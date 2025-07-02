"use client";

import { useState, useCallback, ReactNode } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

type MaybeNumber = number | string;
type LatLngArray = [MaybeNumber, MaybeNumber];

type BaseMapProps = {
  center: { lat: MaybeNumber; lng: MaybeNumber } | LatLngArray;
  zoom?: number;
  children?: ReactNode;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onLoad?: () => void;
  markers?: ({ lat: MaybeNumber; lng: MaybeNumber } | LatLngArray)[];
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
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // Convertir cualquier valor a número y validar finito
  const parseCoord = (v: MaybeNumber | undefined): number => {
    const n = typeof v === "string" ? parseFloat(v) : v;
    if (typeof n !== "number" || !isFinite(n)) {
      console.warn("Coordenada inválida, usando 0:", v);
      return 0;
    }
    return n;
  };

  // Normalizar center: puede ser objeto o tupla
  const numericCenter = Array.isArray(center)
    ? { lat: parseCoord(center[0]), lng: parseCoord(center[1]) }
    : { lat: parseCoord(center.lat), lng: parseCoord(center.lng) };

  // Normalizar marcadores
  const numericMarkers = markers.map((m) =>
    Array.isArray(m)
      ? { lat: parseCoord(m[0]), lng: parseCoord(m[1]) }
      : { lat: parseCoord(m.lat), lng: parseCoord(m.lng) }
  );

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const handleMapLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      mapInstance.setCenter(numericCenter);
      if (onLoad) onLoad();
    },
    [numericCenter, onLoad]
  );

  if (loadError) return <div>Error al cargar Google Maps</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <GoogleMap
        onLoad={handleMapLoad}
        onClick={onClick}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={numericCenter}
        zoom={zoom}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {numericMarkers.map((pos, idx) => (
          <Marker key={idx} position={pos} />
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
