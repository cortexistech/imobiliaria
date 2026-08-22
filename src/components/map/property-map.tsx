"use client";

import dynamic from "next/dynamic";
import type { MapProperty } from "@/components/map/map-inner";

const Inner = dynamic(() => import("@/components/map/map-inner"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full min-h-72 place-items-center bg-mist/50 text-sm text-slate">
      A carregar mapa cadastral…
    </div>
  ),
});

export function PropertyMap({
  properties,
  className,
}: {
  properties: MapProperty[];
  className?: string;
}) {
  return <Inner properties={properties} className={className} />;
}
