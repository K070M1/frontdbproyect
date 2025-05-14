"use client";

import React from "react";
import { MapContainer, TileLayer, Polyline, Polygon, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MapView.module.css";
import { FaMapMarkerAlt, FaRoute, FaShieldAlt } from "react-icons/fa";
import { DivIcon, LatLngTuple } from "leaflet";

import { mockCalificaciones } from "@/data/mockCalificaciones";
import { mockEventos } from "@/data/mockEventos";
import { mockRutas } from "@/data/mockRutas";
import { mockZonas } from "@/data/mockZonas";

const createDivIcon = (icon: React.ReactElement) => {
  const children = (icon as React.ReactElement<{ children: React.ReactNode }>).props.children;
  return new DivIcon({
    html: `<div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">${children}</div>`,
    className: "",
    iconSize: [24, 24],
  });
};

export default function MapView() {
  const center: LatLngTuple = [-12.0464, -77.0428];

  return (
    <div className={styles.mapContainer}>
      <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
        {/* google maps - pendiente */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Eventos */}
        {mockEventos.map((evento) => (
          <Marker
            key={evento.id}
            position={evento.position as LatLngTuple}
            icon={createDivIcon(<FaMapMarkerAlt color="red" size={20} />)}
          >
            <Popup>{evento.descripcion}</Popup>
          </Marker>
        ))}

        {/* Rutas */}
        {mockRutas.map((ruta) => (
          <Polyline key={ruta.id_ruta} positions={ruta.positions as LatLngTuple[]} color="blue">
            <Popup>
              {ruta.origen} ➔ {ruta.destino}
            </Popup>
          </Polyline>
        ))}

        {/* Zonas Seguras */}
        {mockZonas.map((zona) => (
          <Polygon key={zona.id} positions={zona.coordinates as LatLngTuple[]} color="green" fillOpacity={0.3}>
            <Popup>{zona.nombre}</Popup>
          </Polygon>
        ))}

        {/* Calificaciones con ubicación */}
        {mockCalificaciones
          .filter((c) => c.ubicacion)
          .map((c) => (
            <Marker
              key={c.id}
              position={c.ubicacion as LatLngTuple}
              icon={createDivIcon(
                c.tipo === "zona_segura" ? (
                  <FaShieldAlt color="green" size={20} />
                ) : c.tipo === "ruta" ? (
                  <FaRoute color="blue" size={20} />
                ) : (
                  <FaMapMarkerAlt color="orange" size={20} />
                )
              )}
            >
              <Popup>
                <strong>{c.referencia}</strong>
                <br />
                {c.comentario}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
