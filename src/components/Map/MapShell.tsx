"use client";

import dynamic from "next/dynamic";

// Dynamic imports con SSR false para componentes visuales
export const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
export const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });
export const Polygon = dynamic(() => import("react-leaflet").then((m) => m.Polygon), { ssr: false });
export const Polyline = dynamic(() => import("react-leaflet").then((m) => m.Polyline), { ssr: false });
export const Circle = dynamic(() => import("react-leaflet").then((m) => m.Circle), { ssr: false });
export const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
export const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
export const Tooltip = dynamic(() => import("react-leaflet").then((m) => m.Tooltip), { ssr: false });

// useMapEvent es un hook (no necesita dynamic, solo client-side)
export { useMapEvent } from "react-leaflet";
