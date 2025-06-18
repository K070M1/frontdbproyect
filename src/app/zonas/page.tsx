"use client";

import { useState } from "react";

import LayoutShell from "@/components/Layout/LayoutShell";
import ZoneCard from "@/components/Zones/ZoneCard";
import FilterPanel from "@/components/Behavior/FilterPanel";
import SearchBar from "@/components/Behavior/SearchBar";

import { mockZonas } from "@/data/mockZonas";
import styles from "./page.module.css";
import Link from "next/link";

export default function ZonasSegurasPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [query, setQuery] = useState("");

  const zonasFiltradas = mockZonas.filter((zona:any) => {
    const matchesFiltro = activeFilter === "Todos" || zona.riesgo === activeFilter;
    const matchesQuery = zona.nombre.toLowerCase().includes(query.toLowerCase());
    return matchesFiltro && matchesQuery;
  });

  return (
    <LayoutShell>
      <h1 className={styles.title}>Zonas Seguras</h1>

      <div className="bg-indigo-500 text-white rounded-md shadow-md p-2 text-center w-40 my-3 hover:bg-white hover:text-indigo-500 hover:border hover:border-indigo-500">
        <Link href="/zonas/nueva" className={styles.addButton}>
          + Nueva Zona
        </Link>
      </div>


      <div className={styles.actions}>
        <FilterPanel
          filters={["Todos", "Alto", "Medio", "Bajo"]}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <SearchBar query={query} onQueryChange={setQuery} />
      </div>

      <div className={styles.list}>
        {zonasFiltradas.map((zona:any) => (
          <ZoneCard
            key={zona?.id}
            nombre={zona.nombre}
            descripcion={zona.descripcion}
          />
        ))}
      </div>
    </LayoutShell>
  );
}
