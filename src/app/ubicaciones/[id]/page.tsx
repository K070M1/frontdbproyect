"use client";

import React from "react";
import { useParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { DivIcon, LatLngTuple } from "leaflet";
import { FaMapMarkerAlt, FaStar, FaRegStar } from "react-icons/fa";

import LayoutShell from "@/components/Layout/LayoutShell";
import { mockUbicaciones } from "@/data/mockUbicaciones";
import { mockCalificaciones } from "@/data/mockCalificaciones";

import styles from "./page.module.css";

export default function UbicacionDetallePage() {
  const { id } = useParams();
  const ubicacion = mockUbicaciones.find((u) => u.id.toString() === id);

  if (!ubicacion) {
    return (
      <LayoutShell>
        <h1>Ubicación no encontrada</h1>
      </LayoutShell>
    );
  }

  const calificaciones = mockCalificaciones.filter(
    (c) => c.tipo === "zona_segura" && c.referencia.includes(ubicacion.nombre)
  );

  const center: LatLngTuple = [ubicacion.latitud, ubicacion.longitud];

  const icon = new DivIcon({
    html: `<div style="display: flex; align-items: center; justify-content: center; width: 24px; height: 24px;">${FaMapMarkerAlt({ color: "red", size: 20 }).props.children}</div>`,
    className: "",
    iconSize: [24, 24],
  });

  return (
    <LayoutShell>
      <h1 className={styles.title}>{ubicacion.nombre}</h1>
      <p className={styles.description}>{ubicacion.descripcion}</p>

      <div className={styles.mapWrapper}>
        <MapContainer center={center} zoom={15} style={{ height: "400px", width: "100%" }}>
          {/* google maps - pendient*/}
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center} icon={icon}>
            <Popup>
              <strong>{ubicacion.nombre}</strong>
              <br />
              {ubicacion.descripcion}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {calificaciones.length > 0 && (
        <>
          <h2 className={styles.title}>Calificaciones</h2>
          <div className={styles.list}>
            {calificaciones.map((c) => (
              <div key={c.id} className={styles.card}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  {Array.from({ length: 5 }, (_, i) =>
                    i < c.calificacion ? (
                      <FaStar key={i} color="#fbbf24" />
                    ) : (
                      <FaRegStar key={i} color="#d1d5db" />
                    )
                  )}
                  <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>{c.fecha}</span>
                </div>
                <p><strong>{c.usuario}</strong>: {c.comentario}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </LayoutShell>
  );
}
