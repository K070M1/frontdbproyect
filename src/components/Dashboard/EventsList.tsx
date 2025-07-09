"use client";

import { useGetEvents } from "@/services/querys/event.query";
import EventCard from "@/components/Events/EventCard";
import { Evento } from "@/types/entities/Evento";
import styles from "./EventsList.module.css";

export default function EventsList() {
  const {
    data: events = [],
    isLoading,
    isError,
    error,
  } = useGetEvents();

  if (isLoading) {
    return <p>Cargando eventos...</p>;
  }

  if (isError) {
    return <p>Error al cargar eventos: {(error as Error).message}</p>;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Últimos Eventos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {events.map((ev: any) => {
          // Backend devuelve { id_evento, tipo_nombre, descripcion, fecha_registro, lat, lng }
          const evento: Evento = {
            id_evento: ev.id_evento,
            id_tipo_evento: ev.id_tipo_evento,
            tipo_nombre: ev.tipo_nombre,
            descripcion: ev.descripcion,
            fecha_registro: ev.fecha_registro,
            ubicacion: [ev.lat, ev.lng] as [number, number],
          };

          return (
            <EventCard
              key={evento.id_evento}
              evento={evento}
              tipoNombre={evento.tipo_nombre}
            />
          );
        })}
      </div>
    </section>
  );
}
