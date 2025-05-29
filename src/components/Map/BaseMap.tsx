"use client";

import { LatLngTuple } from "leaflet";
import { ReactNode, useMemo } from "react";
import { MapContainer, TileLayer } from "@/components/Map/MapShell";  // si lo centralizas también


type BaseMapProps = {
  center: LatLngTuple;
  zoom?: number;
  children?: ReactNode;
  height?: string;
  provider?: "osm" | "google";  // Escalable a futuro
};

export default function BaseMap({
  center,
  zoom = 14,
  children,
  height = "400px",
  provider = "osm"
}: BaseMapProps) {

  const tileConfig = useMemo(() => {
    switch (provider) {
      case "google":
        return {
          url: "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
          attribution: "&copy; Google Maps",
        };
      case "osm":
      default:
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: "&copy; OpenStreetMap contributors",
        };
    }
  }, [provider]);

  return (
    <div style={{ width: "100%", height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution={tileConfig.attribution} url={tileConfig.url} />
        {children}
      </MapContainer>
    </div>
  );
}
