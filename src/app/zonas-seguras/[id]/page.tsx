"use client";

import { useParams } from "next/navigation";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

import LayoutShell from "@/components/Layout/LayoutShell";
import { mockZonas } from "@/data/mockZonas";
import styles from "./page.module.css";

export default function ZonaSeguraDetallePage() {
  const { id } = useParams();
  const zona = mockZonas.find((z) => z.id.toString() === String(id));

  if (!zona) {
    return (
      <LayoutShell>
        <h1>Zona Segura no encontrada</h1>
      </LayoutShell>
    );
  }

  // Obtener el centro de la zona segura
  const center: LatLngTuple = [zona.coordinates[0][0], zona.coordinates[0][1]];

  // Convertir las coordenadas de la zona a LatLngTuple
  const polygonCoordinates: LatLngTuple[] = zona.coordinates.map(
    (coord) => [coord[0], coord[1]] as LatLngTuple
  );

  return (
    <LayoutShell>
      <h1 className={styles.title}>{zona.nombre}</h1>
      <p className={styles.description}>{zona.descripcion}</p>

      <div className={styles.mapWrapper}>
        <MapContainer center={center} zoom={17} className={styles.mapWrapper}>
          {/* google maps - pendiente */}
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polygon positions={polygonCoordinates} color="green" fillOpacity={0.3}>
            <Popup>{zona.nombre}</Popup>
          </Polygon>
        </MapContainer>
      </div>
    </LayoutShell>
  );
}
