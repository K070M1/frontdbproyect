"use client";

import { useParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { DivIcon, LatLngTuple } from "leaflet";
import { FaExclamationTriangle } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";

import LayoutShell from "@/components/Layout/LayoutShell";
import { mockEventos } from "@/data/mockEventos";
import styles from "./page.module.css";

export default function EventoDetallePage() {
  const { id } = useParams();
  const evento = mockEventos.find((e) => e.id.toString() === String(id));

  if (!evento) {
    return (
      <LayoutShell>
        <h1>Evento no encontrado</h1>
      </LayoutShell>
    );
  }

  const iconHtml = renderToStaticMarkup(<FaExclamationTriangle color="red" size={20} />);
  const icon = new DivIcon({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;">${iconHtml}</div>`,
    className: "",
    iconSize: [24, 24],
  });

  const center: LatLngTuple = [evento.position[0], evento.position[1]];

  return (
    <LayoutShell>
      <h1 className={styles.title}>{evento.tipo}</h1>
      <p className={styles.description}>{evento.descripcion}</p>
      <p className={styles.info}>
        <strong>Fecha:</strong> {new Date(evento.fecha).toLocaleString()}
      </p>

      <div className={styles.mapWrapper}>
        <MapContainer center={center} zoom={17} className={styles.mapWrapper}>
          {/* reemplazar por maps - pendient */}
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center} icon={icon}>
            <Popup>
              <strong>{evento.tipo}</strong>
              <br />
              {evento.descripcion}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </LayoutShell>
  );
}
