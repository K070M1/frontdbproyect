"use client";

import { useState } from "react";
import Link from "next/link";
import LayoutShell from "@/components/Layout/LayoutShell";
import FilterPanel from "@/components/Behavior/FilterPanel";
import SearchBar from "@/components/Behavior/SearchBar";
import RouteCard from "@/components/Routes/RouteCard";
import { mockRutas } from "@/data/mockRutas";
import styles from "./page.module.css";

export default function RutasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filteredRutas = mockRutas.filter((ruta:any) => {
    const matchesQuery =
      ruta?.origen?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ruta?.destino?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "Todos" ||
      (activeFilter === "Bajo" && ruta.riesgo <= 2) ||
      (activeFilter === "Medio" && ruta.riesgo >= 3 && ruta.riesgo <= 4) ||
      (activeFilter === "Alto" && ruta.riesgo >= 5);

    return matchesQuery && matchesFilter;
  });

  return (
    <LayoutShell>
      <h1 className={styles.title}>Rutas</h1>

      <div className={styles.actions}>
        <Link href="/rutas/nueva" className={styles.addButton}>
          + Nueva Ruta
        </Link>
      </div>

      <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
      <FilterPanel
        filters={["Todos", "Bajo", "Medio", "Alto"]}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className={styles.list}>
        {mockRutas.map((ruta:any) => (
          <RouteCard
            key={ruta.id_ruta}
            origen={ruta?.origen}
            destino={ruta?.destino}
            riesgo={ruta.riesgo}
            tiempo={ruta.tiempo_estimado}
            favorito={ruta.favorito}
          />
        ))}
      </div>
    </LayoutShell>
  );
}
