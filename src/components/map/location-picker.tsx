"use client";

import dynamic from "next/dynamic";
import { Crosshair } from "lucide-react";
import { DEFAULT_MAP_CENTER } from "@/lib/constants";

const Picker = dynamic(
  () => import("@/components/map/map-inner").then((mod) => mod.LocationPickerInner),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-64 place-items-center bg-mist/50 text-sm text-slate">
        A carregar mapa…
      </div>
    ),
  },
);

export function LocationPicker({
  lat,
  lng,
  onChange,
}: {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}) {
  function useMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      onChange(position.coords.latitude, position.coords.longitude);
    });
  }

  return (
    <div className="overflow-hidden  border border-ink/15">
      <div className="flex items-center justify-between border-b border-ink/10 bg-white px-3 py-2">
        <p className="font-mono text-[11px] uppercase tracking-wider text-slate">
          {lat.toFixed(5)}, {lng.toFixed(5)}
        </p>
        <button
          type="button"
          onClick={useMyLocation}
          className="inline-flex items-center gap-1 text-xs font-semibold text-field"
        >
          <Crosshair className="h-3.5 w-3.5" />
          Usar a minha localização
        </button>
      </div>
      <div className="h-64">
        <Picker
          lat={lat || DEFAULT_MAP_CENTER.lat}
          lng={lng || DEFAULT_MAP_CENTER.lng}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
