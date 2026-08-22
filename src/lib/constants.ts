export const APP_NAME = "Atlântica Residências";
export const APP_TAGLINE = "Imobiliária no terreno.";

export const PROPERTY_TYPES = [
  "Apartamento",
  "Moradia",
  "Terreno",
  "Comercial",
  "Quinta",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Rascunho",
  PENDING: "Pendente",
  PUBLISHED: "Publicado",
};

export const DEFAULT_MAP_CENTER = { lat: 38.7223, lng: -9.1393 } as const;

export function propertyHref(propertyId: string) {
  return `/imoveis/${propertyId}`;
}
