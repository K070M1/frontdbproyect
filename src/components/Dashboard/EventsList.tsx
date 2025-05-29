"use client";

import EventCard from "@/components/Events/EventCard";
import { mockEventos } from "@/data/mockEventos";
import { TipoEventoEnum } from "@/types/enums/TipoEvento";
import { Evento } from "@/types/entities/Evento";
import { LatLngTuple } from "leaflet";

import styles from "./EventsList.module.css";

export default function EventsList() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Últimos Eventos</h2>
      <div className={styles.grid}>
        {mockEventos.map((eventoRaw) => {
          const tipoNombre = Object.values(TipoEventoEnum)[eventoRaw.id_tipo_evento - 1] ?? "Desconocido";

          const evento: Evento = {
            ...eventoRaw,
            ubicacion: eventoRaw.ubicacion as LatLngTuple,
          };

          return (
            <EventCard
              key={evento.id_evento}
              evento={evento}
              tipoNombre={tipoNombre}
            />
          );
        })}
      </div>
    </section>
  );
}
