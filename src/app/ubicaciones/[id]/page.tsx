"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Marker } from "@/components/Map/MapShell";
import { LatLngTuple } from "leaflet";
import { FaStar, FaRegStar } from "react-icons/fa";

import LayoutShell from "@/components/Layout/LayoutShell";
import BaseMap from "@/components/Map/BaseMap";
import { useMapIcons } from "@/utils/useMapIcons";

import styles from "./page.module.css";

export default function UbicacionDetallePage() {
  const { id } = useParams();
  const ubicacion:any = {}

  const { MARKER } = useMapIcons();

  if (!ubicacion) {
    return (
      <LayoutShell>
        <h1>Ubicación no encontrada</h1>
      </LayoutShell>
    );
  }

  const calificaciones:any = [];

  const center: LatLngTuple = [ubicacion.latitud, ubicacion.longitud];

  return (
    <LayoutShell>
      <h1 className={styles.title}>{ubicacion.nombre}</h1>
      <p className={styles.description}>{ubicacion.descripcion}</p>

     {/*  <div className={styles.mapWrapper}>
        <BaseMap center={center || undefined} zoom={15}>
          <Marker position={center || [0, 0]}>
            <Popup>
              <strong>{ubicacion.nombre}</strong>
              <br />
              {ubicacion.descripcion}
            </Popup>
          </Marker>
        </BaseMap>
      </div> */}

      {calificaciones.length > 0 && (
        <>
          <h2 className={styles.title}>Calificaciones</h2>
          <div className={styles.list}>
            {calificaciones.map((c :any) => (
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
