"use client";

import { useMemo, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

type BaseMapProps = {
  center: { lat: number; lng: number };
  zoom?: number;
  children?: React.ReactNode;
  height?: string;
  width?: string;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onLoad?: () => void;
  markers?: { lat: number; lng: number }[];
  directions?: google.maps.DirectionsResult;
};

export default function GoogleBaseMap({
  center,
  zoom = 14,
  children,
  onClick,
  onLoad,
  markers = [],
  directions,
}: BaseMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
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
        center={center}
        zoom={zoom}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {markers.map((position, idx) => (
          <Marker key={idx} position={position} />
        ))}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#4F46E5",
                strokeOpacity: 0.8,
                strokeWeight: 5,
              },
              suppressMarkers: true,
            }}
          />
        )}

        {children}
      </GoogleMap>
    </div>
  );
}
