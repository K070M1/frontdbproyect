"use client";

import { useState } from "react";

import LayoutShell from "@/components/Layout/LayoutShell";
import ZoneCard from "@/components/Zones/ZoneCard";
import FilterPanel from "@/components/Behavior/FilterPanel";
import SearchBar from "@/components/Behavior/SearchBar";

import { mockZonas } from "@/data/mockZonas";
import styles from "./page.module.css";

export default function ZonasSegurasPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [query, setQuery] = useState("");

  const zonasFiltradas = mockZonas.filter((zona) => {
    const matchesFiltro = activeFilter === "Todos" || zona.riesgo === activeFilter;
    const matchesQuery = zona.nombre.toLowerCase().includes(query.toLowerCase());
    return matchesFiltro && matchesQuery;
  });

  return (
    <LayoutShell>
      <h1 className={styles.title}>Zonas Seguras</h1>

      <div className={styles.actions}>
        <FilterPanel
          filters={["Todos", "Alto", "Medio", "Bajo"]}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <SearchBar query={query} onQueryChange={setQuery} />
      </div>

      <div className={styles.list}>
        {zonasFiltradas.map((zona) => (
          <ZoneCard
            key={zona.id}
            nombre={zona.nombre}
            descripcion={zona.descripcion}
          />
        ))}
      </div>
    </LayoutShell>
  );
}
