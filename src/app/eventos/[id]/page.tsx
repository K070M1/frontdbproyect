"use client";

import { useParams } from "next/navigation";
import { LatLngTuple } from "leaflet";

import LayoutShell from "@/components/Layout/LayoutShell";
import BaseMap from "@/components/Map/BaseMap";
import { useMapIcons } from "@/utils/useMapIcons";
import { mockEventos } from "@/data/mockEventos";

import { Marker, Popup } from "@/components/Map/MapShell";

export default function EventoDetallePage() {
  const { id } = useParams();
  const icons = useMapIcons();

  const evento = mockEventos.find((e) => e.id.toString() === String(id));

  if (!evento) {
    return (
      <LayoutShell>
        <h1>Evento no encontrado</h1>
      </LayoutShell>
    );
  }

  if (!icons.ALERT) {
    return (
      <LayoutShell>
        <h1>Cargando evento...</h1>
      </LayoutShell>
    );
  }

  const center: LatLngTuple = [evento.position[0], evento.position[1]];

  return (
    <LayoutShell>
      <h1>{evento.tipo}</h1>
      <p>{evento.descripcion}</p>

      <BaseMap center={center} zoom={17}>
        <Marker position={center} icon={icons.ALERT}>
          <Popup>{evento.descripcion}</Popup>
        </Marker>
      </BaseMap>
    </LayoutShell>
  );
}
