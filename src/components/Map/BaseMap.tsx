"use client";

import { useMemo } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";


type BaseMapProps = {
  center: { lat: number; lng: number };
  zoom?: number;
  children?: React.ReactNode;
  height?: string;
  width?: string;
};

export default function GoogleBaseMap({ center, zoom = 14, children, height = "400px", width = "100%" }: BaseMapProps) {
  const libraries = useMemo(() => ["places"], []);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries as any,

  });

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="h-[calc(100vh-100px)]!">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center || undefined}
        zoom={zoom}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {children}
      </GoogleMap>
    </div>
  );
}