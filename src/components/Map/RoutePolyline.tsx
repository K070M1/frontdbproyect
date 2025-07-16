"use client";

import { Polyline } from "@/components/Map/MapShell";

type RoutePolylineProps = {
  positions?: any[];
  label: string;
};

export default function RoutePolyline({ positions, label }: RoutePolylineProps) {
  return (
    <Polyline />
  );
}
