"use client";

import { mockEventos } from "@/data/mockEventos";
import { mockRutas } from "@/data/mockRutas";
import { mockZonas } from "@/data/mockZonas";
import { mockCalificaciones } from "@/data/mockCalificaciones";
import GoogleBaseMap from "@/components/Map/BaseMap";
import { Marker, InfoWindow, Polyline, Polygon } from '@/components/Map/MapShell'
import { useMemo, useState, useEffect } from "react";

import styles from "./MapView.module.css";

export default function MapView() {
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [exPos, setExPos] = useState({ lat: -12.188659353427697, lng: -76.97349049095168 })
  const [locationError, setLocationError] = useState<string | null>(null);
  const center = useMemo(() => ({ lat: -12.188659353427697, lng: -76.97349049095168 }), []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización.");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        let errorMessage = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permiso de ubicación denegado. Habilítalo en tu navegador.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Ubicación no disponible. Verifica tu conexión o hardware.";
            break;
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado. Intenta nuevamente.";
            break;
          default:
            errorMessage = "Error desconocido al obtener la ubicación.";
        }
        setLocationError(errorMessage || "");
        console.error("Error de geolocalización:", error);
      },
      options
    );
  }, []);



  return (
    <div className={styles.mapContainer}>
      <GoogleBaseMap center={center} height="800px">
        {userPosition && (
          <Marker
            position={userPosition}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new google.maps.Size(90, 90)
            }}
          >
            <InfoWindow>
              <div>¡Estás aquí!</div>
            </InfoWindow>
          </Marker>
        )}

        {exPos && (
          <Marker
            position={exPos}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          >
          </Marker>
        )}

        {locationError && (
          <div className={styles.locationError}>
            Error: {locationError}
          </div>
        )}

        {mockEventos.map((evento: any, ind) => (
          <Marker 
            key={(evento?.id || "s") + ind} 
            position={evento.position || { lat: 0, lng: 0 }}
          >
          </Marker>
        ))}

        {mockRutas.map((ruta: any) => (
          <Polyline
            key={ruta.id_ruta}
            path={ruta.positions}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 1.0,
              strokeWeight: 2,
            }}
          />
        ))}

        {mockZonas.map((zona: any, zind) => (
          <Polygon
            key={zona?.id || "zon" + zind}
            paths={zona.coordinates}
            options={{
              fillColor: "#FF0000",
              fillOpacity: 0.35,
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        ))}

        {mockCalificaciones
          ?.filter((c: any) => c?.ubicacion)
          ?.map((c: any) => (
            <Marker
              key={c.id}
              position={c.ubicacion!}
            >
              <InfoWindow>
                <div>
                  <strong>{c.referencia}</strong>
                  <br />
                  {c.comentario}
                </div>
              </InfoWindow>
            </Marker>
          ))}
      </GoogleBaseMap>
    </div>
  );
}
