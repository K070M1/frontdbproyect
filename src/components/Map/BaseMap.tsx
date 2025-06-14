"use client";

import { useMemo, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";


type BaseMapProps = {
  center: { lat: number; lng: number };
  zoom?: number;
  children?: React.ReactNode;
  height?: string;
  width?: string;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onLoad?: () => void;
};

export default function GoogleBaseMap({ center, zoom = 14, children, onClick, onLoad }: BaseMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places']
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    if (onLoad) onLoad();
  };

  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="h-[calc(100vh-100px)]!">
      <GoogleMap
        onLoad={handleMapLoad} 
        onClick={onClick}
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