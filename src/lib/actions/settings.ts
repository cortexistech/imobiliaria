"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const settingsSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().max(30).optional().default(""),
  brandColor: z.string().regex(/^#?[0-9A-Fa-f]{6}$/),
  logoUrl: z.string().max(500).optional().default(""),
});

export async function updateTenantSettings(_: unknown, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = settingsSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") || "",
    brandColor: formData.get("brandColor"),
    logoUrl: formData.get("logoUrl") || "",
  });
  if (!parsed.success) return { error: "Verifique os dados da imobiliária." };

  const color = parsed.data.brandColor.startsWith("#")
    ? parsed.data.brandColor
    : `#${parsed.data.brandColor}`;

  await prisma.tenant.update({
    where: { id: admin.tenantId },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      brandColor: color,
      logoUrl: parsed.data.logoUrl.trim() || null,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/");
  return { ok: true };
}
