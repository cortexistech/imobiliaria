import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyAgentWhatsApp } from "@/lib/whatsapp";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const leadSchema = z.object({
  propertyId: z.string().min(8).max(64).regex(/^[a-zA-Z0-9-]+$/),
  clientName: z.string().min(2).max(120),
  clientPhone: z.string().min(6).max(30),
  message: z.string().min(1).max(2000),
  website: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const ipLimit = rateLimit(`lead:ip:${ip}`, 8, 15 * 60 * 1000);
    if (!ipLimit.ok) {
      return NextResponse.json(
        { error: "Demasiados pedidos. Tente mais tarde." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } },
      );
    }

    const json = await req.json();
    const parsed = leadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados do lead inválidos" },
        { status: 400 },
      );
    }

    if (parsed.data.website) {
      return NextResponse.json({ success: true });
    }

    const { propertyId, clientName, clientPhone, message } = parsed.data;

    const propLimit = rateLimit(`lead:prop:${ip}:${propertyId}`, 4, 15 * 60 * 1000);
    if (!propLimit.ok) {
      return NextResponse.json(
        { error: "Demasiados pedidos para este imóvel." },
        { status: 429, headers: { "Retry-After": String(propLimit.retryAfter) } },
      );
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { agent: true },
    });

    if (!property || !property.agent) {
      return NextResponse.json(
        { error: "Imóvel ou corretor não encontrado" },
        { status: 404 },
      );
    }

    if (property.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Este imóvel não está disponível" },
        { status: 400 },
      );
    }

    const lead = await prisma.lead.create({
      data: {
        tenantId: property.tenantId,
        propertyId,
        agentId: property.agentId,
        name: clientName,
        phone: clientPhone,
        message,
      },
    });

    await notifyAgentWhatsApp({
      leadId: lead.id,
      agentPhone: property.agent.phone,
      propertyTitle: property.title,
      clientName,
      clientPhone,
      message,
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error("[leads]", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: "Erro ao processar envio de lead" },
      { status: 500 },
    );
  }
}
