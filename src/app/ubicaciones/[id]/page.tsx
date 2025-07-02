"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LatLngTuple } from "leaflet";
import { FaStar, FaRegStar } from "react-icons/fa";

import LayoutShell from "@/components/Layout/LayoutShell";
import BaseMap from "@/components/Map/BaseMap";
import { Marker, InfoWindow } from "@/components/Map/MapShell";
import { useGetUbicacionById } from "@/services/querys/ubicacion.query";
import { Riesgo } from "@/types/enums/Riesgo";
import { Calificacion } from "@/types/entities/Calificacion";

import styles from "./page.module.css";

export default function UbicacionDetallePage() {
  const { id } = useParams();
  const { data: ubicacion, isLoading, isError } = useGetUbicacionById(String(id));

  if (isLoading) {
    return (
      <LayoutShell>
        <h1>Cargando ubicación...</h1>
      </LayoutShell>
    );
  }

  if (isError || !ubicacion) {
    return (
      <LayoutShell>
        <h1>Ubicación no encontrada</h1>
      </LayoutShell>
    );
  }

  const lat = typeof ubicacion.latitud === "string"
    ? parseFloat(ubicacion.latitud)
    : Number(ubicacion.latitud);
  const lng = typeof ubicacion.longitud === "string"
    ? parseFloat(ubicacion.longitud)
    : Number(ubicacion.longitud);

  const center: LatLngTuple = [lat, lng];

  const riesgoClass = {
    [Riesgo.Bajo]: "riesgoBajo",
    [Riesgo.Medio]: "riesgoMedio",
    [Riesgo.Alto]: "riesgoAlto",
  }[ubicacion.riesgo ?? Riesgo.Medio];

  const calificaciones = (ubicacion.calificaciones ?? []) as Calificacion[];

  return (
    <LayoutShell>
      <h1 className={styles.title}>{ubicacion.nombre}</h1>
      <p className={styles.description}>{ubicacion.descripcion}</p>

      <span className={`${styles.riesgoBadge} ${styles[riesgoClass]}`}>
        {ubicacion.riesgo}
      </span>

      <div className={styles.mapWrapper}>
        <BaseMap center={center} zoom={15}>
          {/* Marcador por defecto */}
          <Marker position={{ lat, lng }} />

          {/* Ventana de información */}
          <InfoWindow position={{ lat, lng }}>
            <div>
              <strong>{ubicacion.nombre}</strong>
              <br />
              {ubicacion.descripcion}
              <br />
              Lat: {lat.toFixed(6)}
              <br />
              Lng: {lng.toFixed(6)}
            </div>
          </InfoWindow>
        </BaseMap>
      </div>

      {calificaciones.length > 0 && (
        <>
          <h2 className={styles.title}>Calificaciones</h2>
          <div className={styles.list}>
            {calificaciones.map((c) => (
              <div key={c.id_calificacion} className={styles.card}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  {Array.from({ length: 5 }, (_, i) =>
                    i < c.calificacion ? <FaStar key={i} /> : <FaRegStar key={i} />
                  )}
                  <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    {new Date(c.fecha_registro).toLocaleDateString()}
                  </span>
                </div>
                <p>
                  <strong>{c.usuario?.nombre_usuario ?? "Usuario"}</strong>: {c.comentario}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </LayoutShell>
  );
}
