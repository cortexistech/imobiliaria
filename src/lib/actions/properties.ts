"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { PropertyStatus, Role } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { PROPERTY_TYPES } from "@/lib/constants";

const propertySchema = z.object({
  title: z.string().min(4).max(120),
  description: z.string().max(4000).optional().default(""),
  type: z.enum(PROPERTY_TYPES),
  price: z.coerce.number().positive(),
  address: z.string().min(4).max(160),
  city: z.string().min(2).max(80),
  bedrooms: z.coerce.number().int().min(0).max(20),
  bathrooms: z.coerce.number().int().min(0).max(20),
  area: z.coerce.number().min(0).max(100000),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  images: z.array(z.string().min(1)).max(20).default([]),
  status: z.nativeEnum(PropertyStatus).optional(),
});

async function assertCanEdit(propertyId: string, userId: string, role: Role, tenantId: string) {
  const property = await prisma.property.findFirst({
    where: { id: propertyId, tenantId },
  });
  if (!property) throw new Error("Imóvel não encontrado.");
  if (role !== Role.ADMIN && property.agentId !== userId) {
    throw new Error("Sem permissão para editar este imóvel.");
  }
  return property;
}

export async function saveProperty(propertyId: string | null, raw: unknown) {
  const user = await requireUser();
  const parsed = propertySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Verifique os dados do imóvel e tente outra vez." };
  }

  const data = parsed.data;
  const requestedStatus =
    data.status ??
    (user.role === Role.ADMIN ? PropertyStatus.PUBLISHED : PropertyStatus.PENDING);

  if (!propertyId) {
    const created = await prisma.property.create({
      data: {
        tenantId: user.tenantId,
        agentId: user.id,
        title: data.title,
        description: data.description,
        type: data.type,
        price: data.price,
        address: data.address,
        city: data.city,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area,
        latitude: data.latitude,
        longitude: data.longitude,
        images: data.images,
        status: requestedStatus,
      },
    });
    revalidatePath("/dashboard/properties");
    revalidatePath("/");
    redirect(`/dashboard/properties/${created.id}`);
  }

  await assertCanEdit(propertyId, user.id, user.role, user.tenantId);
  await prisma.property.update({
    where: { id: propertyId },
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      price: data.price,
      address: data.address,
      city: data.city,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      area: data.area,
      latitude: data.latitude,
      longitude: data.longitude,
      images: data.images,
      status:
        user.role === Role.ADMIN
          ? requestedStatus
          : requestedStatus === PropertyStatus.PUBLISHED
            ? PropertyStatus.PENDING
            : requestedStatus,
    },
  });
  revalidatePath("/dashboard/properties");
  revalidatePath(`/dashboard/properties/${propertyId}`);
  revalidatePath("/");
  revalidatePath(`/imoveis/${propertyId}`);
  return { ok: true };
}

export async function setPropertyStatus(propertyId: string, status: PropertyStatus) {
  const user = await requireAdminUser();
  await prisma.property.updateMany({
    where: { id: propertyId, tenantId: user.tenantId },
    data: { status },
  });
  revalidatePath("/dashboard/properties");
  revalidatePath(`/dashboard/properties/${propertyId}`);
  revalidatePath("/");
  revalidatePath(`/imoveis/${propertyId}`);
}

async function requireAdminUser() {
  const user = await requireUser();
  if (user.role !== Role.ADMIN) throw new Error("Apenas a gestão pode alterar o estado.");
  return user;
}

export async function deleteProperty(propertyId: string) {
  const user = await requireUser();
  await assertCanEdit(propertyId, user.id, user.role, user.tenantId);
  await prisma.property.delete({ where: { id: propertyId } });
  revalidatePath("/dashboard/properties");
  revalidatePath("/");
  redirect("/dashboard/properties");
}
