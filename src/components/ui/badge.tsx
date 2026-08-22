import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "mist",
  className,
}: {
  children: React.ReactNode;
  tone?: "mist" | "field" | "survey" | "lead";
  className?: string;
}) {
  const tones = {
    mist: "bg-mist text-ink",
    field: "bg-field text-on-field",
    survey: "bg-survey text-on-survey",
    lead: "bg-lead/15 text-lead",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-none px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
