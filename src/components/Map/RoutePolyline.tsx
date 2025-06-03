"use client";

import { Polyline, Tooltip } from "@/components/Map/MapShell";
import { LatLngTuple } from "leaflet";

type RoutePolylineProps = {
  positions: LatLngTuple[];
  label: string;
};

export default function RoutePolyline({ positions, label }: RoutePolylineProps) {
  return (
    <Polyline positions={positions || []}>
      <Tooltip sticky>{label}</Tooltip>
    </Polyline>
  );
}
