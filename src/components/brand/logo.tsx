import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={cn("h-9 w-9 shrink-0", className)}
    >
      <rect width="32" height="32" fill={inverted ? "#F0C43C" : "#141414"} />
      <rect x="3" y="3" width="11" height="11" fill={inverted ? "#141414" : "#E8EBE6"} />
      <rect x="18" y="3" width="11" height="11" fill={inverted ? "#141414" : "#E8EBE6"} />
      <rect x="3" y="18" width="11" height="11" fill={inverted ? "#141414" : "#E8EBE6"} />
      <polygon
        points="22.5,16.2 28.8,22.5 22.5,28.8 16.2,22.5"
        fill={inverted ? "#141414" : "#F0C43C"}
      />
    </svg>
  );
}

export function Logo({
  className,
  wordmark = true,
  inverted = false,
  caption,
  name = "Atlântica",
}: {
  className?: string;
  wordmark?: boolean;
  inverted?: boolean;
  caption?: string;
  name?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandMark inverted={inverted} />
      {wordmark ? (
        <span className="grid leading-none">
          <span
            className={cn(
              "font-display text-[1.15rem] font-extrabold tracking-[-0.06em]",
              inverted ? "text-paper" : "text-ink",
            )}
          >
            {name}
          </span>
          {caption ? (
            <span
              className={cn(
                "mt-0.5 font-mono text-[9px] uppercase tracking-[0.22em]",
                inverted ? "text-paper/55" : "text-slate",
              )}
            >
              {caption}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}

export function TapeBar({ thin = false }: { thin?: boolean }) {
  return <div className={thin ? "tape-bar-thin" : "tape-bar"} aria-hidden />;
}

export function FolioFrame({
  children,
  className,
  onInk = false,
}: {
  children: React.ReactNode;
  className?: string;
  onInk?: boolean;
}) {
  return (
    <div className={cn("folio", onInk && "folio-on-ink", className)}>
      <span className="folio-tick folio-tick-tl" />
      <span className="folio-tick folio-tick-tr" />
      <span className="folio-tick folio-tick-bl" />
      <span className="folio-tick folio-tick-br" />
      {children}
    </div>
  );
}
