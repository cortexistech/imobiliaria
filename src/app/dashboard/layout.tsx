import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { DashboardNav } from "@/components/dashboard/nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const tenant = await prisma.tenant.findUniqueOrThrow({
    where: { id: user.tenantId },
  });

  return (
    <div className="flex min-h-full bg-paper">
      <DashboardNav
        role={user.role}
        tenantName={tenant.name}
        userName={user.name ?? "Utilizador"}
        portalHref="/"
      />
      <div className="flex min-h-full flex-1 flex-col pb-16 md:pb-0">
        <div className="tape-bar md:hidden" />
        <main className="flex-1 px-4 py-8 sm:px-10">{children}</main>
      </div>
    </div>
  );
}
