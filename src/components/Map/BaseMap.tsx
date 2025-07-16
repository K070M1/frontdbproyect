"use client";

import { useState, useCallback, ReactNode } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MapMarker } from '@/components/Map/MapShell'
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';

type MaybeNumber = number | string;
type LatLngArray = [MaybeNumber, MaybeNumber];

type BaseMapProps = {
  center: { lat: MaybeNumber; lng: MaybeNumber } | LatLngArray;
  zoom?: number;
  children?: ReactNode;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onLoad?: () => void;
  markers?: (
    | { lat: MaybeNumber; lng: MaybeNumber; type?: string }
    | LatLngArray
  )[];
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
  const { isLoaded, loadError } = useGoogleMaps();

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
  const numericMarkers = markers.map((m: any, idx) =>
    Array.isArray(m)
      ? { coord: { lat: parseCoord(m[0]), lng: parseCoord(m[1]) }, type: m[2] || 'default' }
      : { coord: { lat: parseCoord(m.lat), lng: parseCoord(m.lng) }, type: m.type || 'default' }
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
    <div className="max-w-full h-[calc(100vh-180px)]">
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
        {numericMarkers.map((pos, idx) => {
          const getIconUrl = (type: string) => {
            switch (type) {
              case 'origen':
                return "/map-icons/iStartMap.png";
              case 'destino':
                return "/map-icons/iMetaMap.png";
              default:
                return "/map-icons/iPersonMap.png";
            }
          };
          
          return (
            <MapMarker 
              key={idx} 
              position={pos.coord} 
              iconUrl={getIconUrl(pos.type)}
            />
          );
        })}

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
