"use client";
import { useState, useEffect } from 'react'
import dynamic from "next/dynamic";
import { MarkerProps } from '@react-google-maps/api';

type MapMarkerProps = Omit<MarkerProps, "icon"> & {
  iconUrl?: string;
  iconSize?: { width: number; height: number };
};
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

export { useGoogleMap } from "@react-google-maps/api";

export const LoadScript = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.LoadScript),
  { ssr: false }
);

export const MapMarker = dynamic(() => {
  const Component = ({ position, iconUrl = "/map-icons/iPersonMap.png", iconSize = { width: 40, height: 40 }, ...markerProps }: MapMarkerProps) => {
    const [icon, setIcon] = useState<google.maps.Icon | null>(null);

    useEffect(() => {
      if (!position || icon) return;
      const createIcon = () => {
        if (typeof window !== 'undefined' && window.google?.maps?.Size) {
          return { url: iconUrl, scaledSize: new window.google.maps.Size(iconSize.width, iconSize.height) };
        }
        return null;
      };

      const newIcon = createIcon();
      if (newIcon) {
        setIcon(newIcon);
        return;
      }

      const timeoutId = setTimeout(() => {
        const retryIcon = createIcon();
        if (retryIcon) setIcon(retryIcon);
      }, 300);

      return () => clearTimeout(timeoutId);
    }, [position, iconUrl, iconSize]);

    if (!position || !icon) return null;

    return <Marker position={position} icon={icon} {...markerProps} />;
  };
  return Promise.resolve(Component);
}, { ssr: false });

export type LatLng = google.maps.LatLngLiteral;
export type MapOptions = google.maps.MapOptions;
export type MarkerOptions = google.maps.marker.AdvancedMarkerElement;
export type PolygonOptions = google.maps.PolygonOptions;
export type PolylineOptions = google.maps.PolylineOptions;
export type CircleOptions = google.maps.CircleOptions;