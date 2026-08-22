import Link from "next/link";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { PropertyCard } from "@/components/properties/property-card";

export const metadata = { title: "Imóveis" };

export default async function PropertiesPage() {
  const user = await requireUser();
  const properties = await prisma.property.findMany({
    where:
      user.role === Role.ADMIN
        ? { tenantId: user.tenantId }
        : { tenantId: user.tenantId, agentId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
            Carteira
          </p>
          <h1 className="font-display text-4xl font-semibold">Imóveis</h1>
        </div>
        <Link
          href="/dashboard/properties/new"
          className="bg-field px-4 py-2.5 text-sm font-semibold text-on-field"
        >
          Cadastrar no terreno
        </Link>
      </div>
      {properties.length === 0 ? (
        <p className="mt-10 text-slate">
          Ainda não há imóveis. Comece pelo telemóvel, com fotografia e pino no mapa.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              href={`/dashboard/properties/${property.id}`}
              showStatus
            />
          ))}
        </div>
      )}
    </div>
  );
}
