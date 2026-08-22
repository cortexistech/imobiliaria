import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { TeamManager } from "@/components/dashboard/team-manager";

export const metadata = { title: "Equipa" };

export default async function TeamPage() {
  const admin = await requireAdmin();
  const members = await prisma.user.findMany({
    where: { tenantId: admin.tenantId },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { properties: true, leads: true } } },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
        Organização
      </p>
      <h1 className="mb-8 font-display text-4xl font-semibold">Equipa</h1>
      <TeamManager members={members} currentUserId={admin.id} />
    </div>
  );
}
