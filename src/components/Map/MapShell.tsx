"use client";
import dynamic from "next/dynamic";

export const GoogleMap = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.GoogleMap),
  { ssr: false }
);

export const Marker = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.Marker),
  { ssr: false }
);

export const InfoWindow = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.InfoWindow),
  { ssr: false }
);

export const Polygon = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.Polygon),
  { ssr: false }
);

export const Polyline = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.Polyline),
  { ssr: false }
);

export const Circle = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.Circle),
  { ssr: false }
);

// No hay equivalente exacto a TileLayer en Google Maps
// No hay equivalente directo a Tooltip, se usa InfoWindow

export { useGoogleMap } from "@react-google-maps/api";

export const LoadScript = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.LoadScript),
  { ssr: false }
);

export type LatLng = google.maps.LatLngLiteral;
export type MapOptions = google.maps.MapOptions;
export type MarkerOptions = google.maps.MarkerOptions;
export type PolygonOptions = google.maps.PolygonOptions;
export type PolylineOptions = google.maps.PolylineOptions;
export type CircleOptions = google.maps.CircleOptions;