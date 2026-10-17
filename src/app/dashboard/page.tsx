import Link from "next/link";
import { Role } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function DashboardHome() {
  const user = await requireUser();
  const isAdmin = user.role === Role.ADMIN;

  const [tenant, propertyCount, leadCount, pendingCount, recentLeads, recentProperties] =
    await Promise.all([
      prisma.tenant.findUniqueOrThrow({ where: { id: user.tenantId } }),
      prisma.property.count({
        where: isAdmin ? { tenantId: user.tenantId } : { tenantId: user.tenantId, agentId: user.id },
      }),
      prisma.lead.count({
        where: isAdmin ? { tenantId: user.tenantId } : { tenantId: user.tenantId, agentId: user.id },
      }),
      prisma.property.count({
        where: { tenantId: user.tenantId, status: "PENDING" },
      }),
      prisma.lead.findMany({
        where: isAdmin ? { tenantId: user.tenantId } : { tenantId: user.tenantId, agentId: user.id },
        include: { property: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.property.findMany({
        where: isAdmin ? { tenantId: user.tenantId } : { tenantId: user.tenantId, agentId: user.id },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
    ]);

  const stats = [
    { label: "Imóveis", value: String(propertyCount) },
    { label: "Leads", value: String(leadCount) },
    { label: isAdmin ? "Aprovação" : "Carteira", value: isAdmin ? String(pendingCount) : String(propertyCount) },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bronze">
            {tenant.name}
          </p>
          <h1 className="font-display text-4xl font-extrabold">Quadro de terreno</h1>
        </div>
        <Link
          href="/dashboard/properties/new"
          className="bg-survey px-4 py-2.5 text-sm font-semibold text-on-survey"
        >
          Novo imóvel
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label} className="border border-ink/10 bg-white p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-slate">{stat.label}</p>
            <p className="mt-2 font-display text-4xl font-semibold">{stat.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl font-semibold">Últimos leads</h2>
          <ul className="mt-4 divide-y divide-ink/10 border border-ink/10 bg-white">
            {recentLeads.length === 0 ? (
              <li className="p-5 text-sm text-slate">Ainda sem pedidos de visita.</li>
            ) : (
              recentLeads.map((lead) => (
                <li key={lead.id} className="p-4">
                  <p className="font-semibold">{lead.name}</p>
                  <p className="text-sm text-slate">
                    {lead.property.title} · {formatDate(lead.createdAt)}
                  </p>
                  <p className="mt-1 font-mono text-xs">{lead.phone}</p>
                </li>
              ))
            )}
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold">Carteira recente</h2>
          <ul className="mt-4 divide-y divide-ink/10 border border-ink/10 bg-white">
            {recentProperties.map((property) => (
              <li key={property.id} className="flex items-center justify-between p-4">
                <div>
                  <Link href={`/dashboard/properties/${property.id}`} className="font-semibold hover:text-field">
                    {property.title}
                  </Link>
                  <p className="text-sm text-slate">{property.city}</p>
                </div>
                <p className="font-mono text-sm">{formatPrice(property.price)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
