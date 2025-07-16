"use client";

import { Polygon} from "@/components/Map/MapShell";
import { LatLngTuple } from "leaflet";

type ZonePolygonProps = {
  coordinates: LatLngTuple[];
  label: string;
};

export default function ZonePolygon({ coordinates, label }: ZonePolygonProps) {
  return (
    <Polygon />
  );
}
