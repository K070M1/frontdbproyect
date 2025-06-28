"use client";

import { useState, useEffect } from "react";
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Esto evita renderizar nada hasta que el cliente esté listo

  const filteredRutas = mockRutas.filter((ruta: any) => {
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

      <div className={styles.searchBar}>
        <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
      </div>

      <FilterPanel
        filters={["Todos", "Bajo", "Medio", "Alto"]}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className={styles.list}>
        {filteredRutas.length > 0 ? (
          filteredRutas.map((ruta: any) => (
            <RouteCard
              key={ruta.id_ruta}
              origen={ruta?.origen}
              destino={ruta?.destino}
              riesgo={ruta.riesgo}
              tiempo={ruta.tiempo_estimado}
              favorito={ruta.favorito}
            />
          ))
        ) : (
          <div className={styles.noResults}>
            <p>No hay rutas que coincidan con tu búsqueda</p>
            <p
              style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.7 }}
            >
              Intenta con otros términos de búsqueda o ajusta los filtros
            </p>
          </div>
        )}
      </div>
    </LayoutShell>
  );
}
