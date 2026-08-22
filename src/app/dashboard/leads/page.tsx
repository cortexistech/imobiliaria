import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Leads" };

export default async function LeadsPage() {
  const user = await requireUser();
  const leads = await prisma.lead.findMany({
    where:
      user.role === Role.ADMIN
        ? { tenantId: user.tenantId }
        : { tenantId: user.tenantId, agentId: user.id },
    include: { property: true, agent: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
        WhatsApp
      </p>
      <h1 className="font-display text-4xl font-semibold">Leads</h1>
      <p className="mt-2 max-w-xl text-sm text-slate">
        Cada linha nasceu de um formulário na vitrine. O alerta já foi enviado ao
        telemóvel do corretor responsável.
      </p>
      <div className="mt-8 overflow-hidden  border border-ink/10 bg-white">
        {leads.length === 0 ? (
          <p className="p-6 text-sm text-slate">Sem leads para mostrar.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-paper font-mono text-[11px] uppercase tracking-wider text-slate">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Imóvel</th>
                <th className="hidden px-4 py-3 md:table-cell">Corretor</th>
                <th className="hidden px-4 py-3 md:table-cell">Data</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-ink/10 align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{lead.name}</p>
                    <p className="font-mono text-xs">{lead.phone}</p>
                    <p className="mt-1 text-slate">{lead.message}</p>
                  </td>
                  <td className="px-4 py-3">{lead.property.title}</td>
                  <td className="hidden px-4 py-3 md:table-cell">{lead.agent.name}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
