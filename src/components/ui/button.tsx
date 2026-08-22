import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-field text-on-field hover:bg-field-deep border-transparent",
  survey:
    "bg-survey text-on-survey hover:brightness-95 border-transparent",
  ghost:
    "bg-transparent text-ink hover:bg-mist/70 border-transparent",
  outline:
    "bg-white text-ink border-ink/20 hover:border-ink/50",
  danger:
    "bg-lead text-white hover:brightness-110 border-transparent",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-none border px-4 py-2.5 text-sm font-semibold tracking-wide transition disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
