"use client";

import { useState } from "react";
import Link from "next/link";

import LayoutShell from "@/components/Layout/LayoutShell";
import FilterPanel from "@/components/Behavior/FilterPanel";
import SearchBar from "@/components/Behavior/SearchBar";
import EventCard from "@/components/Events/EventCard";

import { mockEventos } from "@/data/mockEventos";
import { TipoEventoEnum } from "@/types/enums/TipoEvento";
import { Evento } from "@/types/entities/Evento";
import { LatLngTuple } from "leaflet";

import styles from "./page.module.css";

export default function EventosPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [query, setQuery] = useState("");

  const filtros = ["Todos", ...Object.values(TipoEventoEnum)];

  const getTipoNombre = (idTipo: number): TipoEventoEnum => {
    const valores = Object.values(TipoEventoEnum);
    return valores[idTipo - 1] ?? TipoEventoEnum.Otro;
  };

  const eventosFiltrados = mockEventos.filter((evento) => {
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
        {eventosFiltrados.map((eventoRaw) => {
          const evento: Evento = {
            ...eventoRaw,
            ubicacion: eventoRaw.ubicacion as LatLngTuple,
          };

          return (
            <EventCard
              key={evento.id_evento}
              evento={evento}
              tipoNombre={getTipoNombre(evento.id_tipo_evento)}
            />
          );
        })}
      </div>
    </LayoutShell>
  );
}
