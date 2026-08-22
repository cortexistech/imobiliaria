import Link from "next/link";
import { asImages, formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/properties/status-badge";
import { FolioFrame } from "@/components/brand/logo";
import type { Property, PropertyStatus } from "@prisma/client";

export function PropertyCard({
  property,
  href,
  showStatus = false,
}: {
  property: Pick<
    Property,
    | "id"
    | "title"
    | "price"
    | "type"
    | "city"
    | "address"
    | "bedrooms"
    | "area"
    | "images"
    | "status"
  >;
  href: string;
  showStatus?: boolean;
}) {
  const image = asImages(property.images)[0];
  return (
    <Link href={href} className="group block">
      <FolioFrame className="surface overflow-hidden transition group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_40px_rgba(11,18,16,0.1)]">
        <div className="relative aspect-[4/3] bg-mist">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center font-mono text-[10px] uppercase tracking-wider text-slate">
              Sem fotografia
            </div>
          )}
          <span className="absolute bottom-3 left-0 bg-survey px-3 py-1 font-mono text-[11px] font-semibold text-on-survey">
            {formatPrice(property.price)}
          </span>
          {showStatus ? (
            <span className="absolute right-3 top-3">
              <StatusBadge status={property.status as PropertyStatus} />
            </span>
          ) : null}
        </div>
        <div className="border-l-[3px] border-field p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate">
            {property.type} · {property.city}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold leading-tight group-hover:text-field">
            {property.title}
          </h3>
          <p className="mt-1 text-sm text-slate">{property.address}</p>
          <p className="mt-2 font-mono text-[11px] text-ink/70">
            {property.bedrooms > 0 ? `${property.bedrooms} quartos · ` : ""}
            {property.area > 0 ? `${property.area} m²` : ""}
          </p>
        </div>
      </FolioFrame>
    </Link>
  );
}
