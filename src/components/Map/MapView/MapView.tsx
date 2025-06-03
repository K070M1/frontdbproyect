"use client";

import { LatLngTuple } from "leaflet";

import LayoutShell from "@/components/Layout/LayoutShell";
import BaseMap from "@/components/Map/BaseMap";
import RoutePolyline from "../RoutePolyline";
import ZonePolygon from "../ZonePolygon";
import { Marker, Popup } from "@/components/Map/MapShell";

import { useMapIcons } from "@/utils/useMapIcons";
import { mockEventos } from "@/data/mockEventos";
import { mockRutas } from "@/data/mockRutas";
import { mockZonas } from "@/data/mockZonas";
import { mockCalificaciones } from "@/data/mockCalificaciones";

import styles from "./MapView.module.css";

export default function MapView() {
  const icons = useMapIcons();

  const center: LatLngTuple = [-12.0464, -77.0428];

  if (!icons.MARKER) return <LayoutShell><p>Cargando mapa...</p></LayoutShell>;

  return (
    <div className={styles.mapContainer}>
      <BaseMap center={center}>
        {mockEventos.map((evento:any, ind) => (
          <Marker key={(evento?.id || "s") + ind} position={evento.position || { lat: "", lng: ""}} icon={icons.ALERT}>
            <Popup>{evento.descripcion}</Popup>
          </Marker>
        ))}

        {mockRutas.map((ruta:any) => (
          <RoutePolyline
            key={ruta.id_ruta}
            positions={ruta.positions}
            label={`${ruta.origen} ➔ ${ruta.destino}`}
          />
        ))}

        {mockZonas.map((zona:any, zind) => (
          <ZonePolygon
            key={zona?.id || "zon" + zind }
            coordinates={zona.coordinates}
            label={zona.nombre}
          />
        ))}

        {mockCalificaciones
          .filter((c:any) => c.ubicacion)
          .map((c:any) => (
            <Marker
              key={c.id}
              position={c.ubicacion!}
              icon={
                c.tipo === "zona_segura"
                  ? icons.ZONE
                  : c.tipo === "ruta"
                  ? icons.ROUTE
                  : icons.MARKER
              }
            >
              <Popup>
                <strong>{c.referencia}</strong>
                <br />
                {c.comentario}
              </Popup>
            </Marker>
          ))}
      </BaseMap>
    </div>
  );
}
