import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getAgency() {
  return prisma.tenant.findFirst({
    orderBy: { createdAt: "asc" },
  });
}

export async function requireAgency() {
  const agency = await getAgency();
  if (!agency) notFound();
  return agency;
}
