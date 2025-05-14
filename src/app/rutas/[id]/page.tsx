"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { LatLngTuple } from "leaflet";
import LayoutShell from "@/components/Layout/LayoutShell";
import { mockRutas } from "@/data/mockRutas";
import styles from "./page.module.css";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

import "leaflet/dist/leaflet.css";

export default function RutaDetallePage() {
  const { id } = useParams();
  const ruta = mockRutas.find((r) => r.id_ruta.toString() === String(id));

  if (!ruta) {
    return (
      <LayoutShell>
        <h1>Ruta no encontrada</h1>
      </LayoutShell>
    );
  }

  const origen: LatLngTuple = ruta.positions[0] as LatLngTuple;
  const destino: LatLngTuple = ruta.positions[ruta.positions.length - 1] as LatLngTuple;
  const positions: LatLngTuple[] = ruta.positions as LatLngTuple[];

  return (
    <LayoutShell>
      <h1 className={styles.title}>{ruta.origen} ➔ {ruta.destino}</h1>
      <p className={styles.info}><strong>Riesgo:</strong> {ruta.riesgo}</p>
      <p className={styles.info}><strong>Tiempo estimado:</strong> {ruta.tiempo_estimado}</p>
      {ruta.favorito && <p className={styles.favorite}>★ Ruta favorita</p>}

      <div className={styles.mapWrapper}>
        <MapContainer center={origen} zoom={15} className={styles.mapWrapper}>
          {/* Usar google maps- pendient */}
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={positions} color="blue">
            <Popup>Ruta: {ruta.origen} ➔ {ruta.destino}</Popup>
          </Polyline>
          <Marker position={origen}>
            <Popup>Origen: {ruta.origen}</Popup>
          </Marker>
          <Marker position={destino}>
            <Popup>Destino: {ruta.destino}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </LayoutShell>
  );
}
