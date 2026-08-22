"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { DEFAULT_MAP_CENTER } from "@/lib/constants";

const pin = L.divIcon({
  className: "imobi-pin",
  html: "<span></span>",
  iconSize: [18, 18],
  iconAnchor: [9, 18],
  popupAnchor: [0, -16],
});

export type MapProperty = {
  id: string;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
  href?: string;
};

function FitBounds({ properties }: { properties: MapProperty[] }) {
  const map = useMap();
  useEffect(() => {
    if (properties.length === 0) return;
    const bounds = L.latLngBounds(
      properties.map((item) => [item.latitude, item.longitude] as [number, number]),
    );
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 14 });
  }, [map, properties]);
  return null;
}

export default function PropertyMapInner({
  properties,
  className = "h-full w-full",
}: {
  properties: MapProperty[];
  className?: string;
}) {
  const center = properties[0]
    ? ([properties[0].latitude, properties[0].longitude] as [number, number])
    : ([DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng] as [number, number]);

  return (
    <MapContainer
      center={center}
      zoom={12}
      className={className}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds properties={properties} />
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.latitude, property.longitude]}
          icon={pin}
        >
          <Popup>
            <div className="min-w-40">
              <p className="font-display text-sm font-semibold">{property.title}</p>
              <p className="font-mono text-xs text-field">{formatPrice(property.price)}</p>
              {property.href ? (
                <Link href={property.href} className="mt-1 inline-block text-xs font-semibold text-field">
                  Ver imóvel
                </Link>
              ) : null}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function ClickCapture({
  onChange,
}: {
  onChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

export function LocationPickerInner({
  lat,
  lng,
  onChange,
}: {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}) {
  return (
    <MapContainer center={[lat, lng]} zoom={14} className="h-full w-full" scrollWheelZoom>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickCapture onChange={onChange} />
      <Marker position={[lat, lng]} icon={pin} />
    </MapContainer>
  );
}
