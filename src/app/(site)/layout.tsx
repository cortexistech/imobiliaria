import Link from "next/link";
import { BrandMark } from "@/components/brand/logo";
import { getAgency, requireAgency } from "@/lib/tenant";

export async function generateMetadata() {
  const agency = await getAgency();
  if (!agency) return { title: "Imobiliária" };
  return {
    title: {
      default: agency.name,
      template: `%s · ${agency.name}`,
    },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const agency = await requireAgency();

  return (
    <div
      className="flex min-h-full flex-col bg-paper"
      style={{ ["--field" as string]: agency.brandColor }}
    >
      <div className="tape-bar" />
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            {agency.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={agency.logoUrl} alt="" className="h-9 w-auto" />
            ) : (
              <BrandMark />
            )}
            <span className="grid leading-none">
              <span className="font-display text-lg font-extrabold tracking-tight">
                {agency.name}
              </span>
              <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-slate">
                imobiliária
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-5">
            {agency.phone ? (
              <a href={`tel:${agency.phone}`} className="text-sm font-semibold text-field">
                {agency.phone}
              </a>
            ) : null}
            <Link href="/login" className="text-sm font-semibold text-ink/70 hover:text-field">
              Equipa
            </Link>
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-ink/10 bg-ink px-4 py-6 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50">
        {agency.name} · carteira no terreno
      </footer>
    </div>
  );
}
