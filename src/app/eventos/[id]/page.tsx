"use client";

import { useParams } from "next/navigation";
import { LatLngTuple } from "leaflet";

import BaseMap from "@/components/Map/BaseMap";
import { useMapIcons } from "@/utils/useMapIcons";
import EventForm from "@/components/Events/EventForm";
import { Marker, Popup } from "@/components/Map/MapShell";
import { useGetEvent } from '@/services/querys/event.query'
import { useEffect, useState } from "react";



export default function EventoDetallePage() {
  const { id } = useParams();
  const [evento, setEvento] = useState<any>([]);
  const icons = useMapIcons();

  const { mutateAsync: getEvent, isPending } = useGetEvent();

  const searchEvent = async (id: any) => {
    const res = await getEvent(id);
    if (res) {
      setEvento(res);
    } else {
      setEvento(null);
    }
  }

  useEffect(() => {
    if (id) {
      searchEvent(id);
    }
  }, [id]);

  if (!evento) {
    return (
      <div className={styles.container}>
        <h1>Evento no encontrado</h1>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className={styles.container}>
        <h1>Cargando evento...</h1>
      </div>
    );
  }

  return (
   <div className={styles.container}>
      <h3 className="text-center font-semibold">Editar evento</h3>
      <EventForm evento={evento.length > 0 ? evento[0] : null} />
    </div>
  );
}
