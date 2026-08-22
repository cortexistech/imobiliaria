import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAgency } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { asImages, formatPrice } from "@/lib/utils";
import { LeadForm } from "@/components/portal/lead-form";
import { PropertyMap } from "@/components/map/property-map";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  const agency = await requireAgency();
  const property = await prisma.property.findFirst({
    where: { id: propertyId, tenantId: agency.id, status: "PUBLISHED" },
    select: { title: true },
  });
  return { title: property?.title ?? "Imóvel" };
}

export default async function PublicPropertyPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  const agency = await requireAgency();

  const property = await prisma.property.findFirst({
    where: { id: propertyId, tenantId: agency.id, status: "PUBLISHED" },
    include: { agent: true },
  });
  if (!property) notFound();

  const images = asImages(property.images);

  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/" className="text-sm font-semibold text-field">
        ← Voltar à carteira
      </Link>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {images.length === 0 ? (
          <div className="grid aspect-[4/3] place-items-center bg-mist text-slate">
            Sem fotografias
          </div>
        ) : (
          images.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className="aspect-[4/3] w-full object-cover"
            />
          ))
        )}
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-slate">
            {property.type} · {property.city}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold">{property.title}</h1>
          <p className="mt-3 font-display text-3xl text-field">{formatPrice(property.price)}</p>
          <p className="mt-4 text-slate">{property.address}</p>
          <dl className="mt-6 grid grid-cols-3 gap-3 font-mono text-sm">
            <div className="bg-white p-3">
              <dt className="text-[11px] uppercase text-slate">Quartos</dt>
              <dd>{property.bedrooms}</dd>
            </div>
            <div className="bg-white p-3">
              <dt className="text-[11px] uppercase text-slate">WCs</dt>
              <dd>{property.bathrooms}</dd>
            </div>
            <div className="bg-white p-3">
              <dt className="text-[11px] uppercase text-slate">Área</dt>
              <dd>{property.area} m²</dd>
            </div>
          </dl>
          <p className="mt-6 max-w-2xl leading-relaxed text-ink/80">{property.description}</p>
          <p className="mt-6 text-sm text-slate">
            Corretor responsável: {property.agent.name}
          </p>
          <div className="mt-6 h-72 overflow-hidden border border-ink/10">
            <PropertyMap
              properties={[
                {
                  id: property.id,
                  title: property.title,
                  price: Number(property.price),
                  latitude: property.latitude,
                  longitude: property.longitude,
                },
              ]}
            />
          </div>
        </div>
        <LeadForm propertyId={property.id} propertyTitle={property.title} />
      </div>
    </article>
  );
}
