"use client";
import { FaExclamationTriangle, FaShieldAlt, FaCarCrash, FaClock } from "react-icons/fa";
import { IoWarningOutline, IoPin } from "react-icons/io5";
import { GiNinjaMask } from "react-icons/gi";

import { useState } from "react";
import Link from "next/link";

import LayoutShell from "@/components/Layout/LayoutShell";
import FilterPanel from "@/components/Behavior/FilterPanel";
import SearchBar from "@/components/Behavior/SearchBar";
import EventCard from "@/components/Events/EventCard";

import { useGetEvents } from '@/services/querys/event.query'
import { useGetTypeEvents } from '@/services/querys/type_event.query'
import { useSelectableList } from '@/hooks/useList'

import styles from "./page.module.css";

export default function EventosPage() {
  const { data: queryEvents } = useGetEvents();
  const { data: queryTypeEvent } = useGetTypeEvents();
  const listTypeEvents = useSelectableList(queryTypeEvent);
  const listEvents = useSelectableList(queryEvents);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [query, setQuery] = useState("");
  
  const filtros = ["Todos", ...listTypeEvents.list.map((type:any) => type.nombre)];

  const getTipoNombre = (idTipo: number): any => {
    const tipo:any = listTypeEvents.list.find((type:any) => type.id_tipo_evento === idTipo);
    return tipo ? tipo.nombre : "Otro";
  };

  const eventosFiltrados = listEvents.list.filter((evento:any) => {
    const tipoNombre = getTipoNombre(evento.id_tipo_evento);
    const matchesFiltro = activeFilter === "Todos" || tipoNombre === activeFilter;
    const matchesQuery = evento.descripcion.toLowerCase().includes(query.toLowerCase());
    return matchesFiltro && matchesQuery;
  });

  return (
    <LayoutShell>
      <h1 className={styles.title}>Eventos Registrados</h1>

      <div className={styles.actions}>
        <FilterPanel
          filters={filtros}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <SearchBar query={query} onQueryChange={setQuery} />
        <Link href="/eventos/nuevo" className={styles.addButton}>
          + Nuevo Evento
        </Link>
      </div>

      <div className={styles.list}>
        {eventosFiltrados.map((eventoRaw:any) => {
          const evento = {
            ...eventoRaw,
            ubicacion: {
              lat: eventoRaw.lat,
              lng: eventoRaw.lng,
            }
          };
          return (
            <EventCard
              key={evento.id_evento}
              evento={evento}
              tipoNombre={getTipoNombre(evento.id_tipo_evento)}
              ubicacion={evento.ubicacion}
              time={evento.fecha_registro}
              Icon={() => {
                const name = getTipoNombre(evento.id_tipo_evento);
                switch (name) {
                  case "Otro": return (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 border border-gray-400 text-gray-500 bg-gray-500/10 rounded-md`}>
                      <FaExclamationTriangle className="size-4 text-gray-500" />
                      {name}
                    </div>
                  );
                  case "Policia": return (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 border border-blue-400 text-blue-500 bg-blue-500/10 rounded-md`}>
                      <FaShieldAlt className="size-4 text-blue-400" />
                      {name}
                    </div>
                  );
                  case "Choque": return (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 border border-red-400 text-red-500 bg-red-500/10 rounded-md`}>
                      <FaCarCrash className="size-4 text-red-400" />
                      {name}
                    </div>
                  );
                  case "Robo": return (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 border border-gray-400 text-gray-500 bg-gray-500/10 rounded-md`}>
                      <GiNinjaMask className="size-4 text-gray-600" />
                      {name}
                    </div>
                  );
                  default: return (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 border border-gray-400 text-gray-500 bg-gray-500/10 rounded-md`}>
                      <IoWarningOutline className="size-4 text-gray-400" />
                      {name}
                    </div>
                  );
                }
              }}
            />
          );
        })}
      </div>
    </LayoutShell>
  );
}
