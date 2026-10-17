import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function getSession() {
  return auth();
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!dbUser) redirect("/login");

  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
    tenantId: dbUser.tenantId,
    phone: dbUser.phone,
  };
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== Role.ADMIN) redirect("/dashboard");
  return user;
}
