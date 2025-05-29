"use client";

import { Polygon, Tooltip } from "@/components/Map/MapShell";
import { LatLngTuple } from "leaflet";

type ZonePolygonProps = {
  coordinates: LatLngTuple[];
  label: string;
};

export default function ZonePolygon({ coordinates, label }: ZonePolygonProps) {
  return (
    <Polygon positions={coordinates}>
      <Tooltip sticky>{label}</Tooltip>
    </Polygon>
  );
}
