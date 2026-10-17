import { Prisma } from "@/generated/prisma/client";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(value: Prisma.Decimal | number | string) {
  const amount = typeof value === "number" ? value : Number(value);
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function asImages(images: Prisma.JsonValue): string[] {
  if (!Array.isArray(images)) return [];
  return images.filter((item): item is string => typeof item === "string");
}
