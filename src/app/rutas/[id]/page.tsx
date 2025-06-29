"use client";

import { useParams } from "next/navigation";
import { LatLngTuple } from "leaflet";

import LayoutShell from "@/components/Layout/LayoutShell";
import BaseMap from "@/components/Map/BaseMap";

import styles from "./page.module.css";

export default function RutaDetallePage() {
  const { id } = useParams();
  const ruta:any = null

  if (!ruta) {
    return (
      <LayoutShell>
        <h1>Ruta no encontrada</h1>
      </LayoutShell>
    );
  }

  const origen: LatLngTuple = ruta.positions[0] as LatLngTuple;
  const destino: LatLngTuple = ruta.positions[ruta.positions.length - 1] as LatLngTuple;

  return (
    <LayoutShell>
      <h1 className={styles.title}>{ruta.origen} ➔ {ruta.destino}</h1>
      <p className={styles.info}><strong>Riesgo:</strong> {ruta.riesgo}</p>
      <p className={styles.info}><strong>Tiempo estimado:</strong> {ruta.tiempo_estimado}</p>
      {ruta.favorito && <p className={styles.favorite}>★ Ruta favorita</p>}

      {/* <div className={styles.mapWrapper}>
        <BaseMap center={origen} zoom={15}>
          <Polyline positions={ruta.positions as LatLngTuple[]} color="blue">
            <Popup>Ruta: {ruta.origen} ➔ {ruta.destino}</Popup>
          </Polyline>
          <Marker position={origen}>
            <Popup>Origen: {ruta.origen}</Popup>
          </Marker>
          <Marker position={destino}>
            <Popup>Destino: {ruta.destino}</Popup>
          </Marker>
        </BaseMap>
      </div> */}
    </LayoutShell>
  );
}
