"use client";
import { useGetRoutes } from '@/services/querys/routes.query'
import { useState, useEffect } from "react";
import Link from "next/link";
import LayoutShell from "@/components/Layout/LayoutShell";
import FilterPanel from "@/components/Behavior/FilterPanel";
import SearchBar from "@/components/Behavior/SearchBar";
import RouteCard from "@/components/Routes/RouteCard";
import styles from "./page.module.css";
import { useSelectableList } from '@/hooks/useList'

export default function RutasPage() {
  const { data: queryRoute } = useGetRoutes();
  const { list, active, setActive, setById } = useSelectableList(queryRoute);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
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

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        { queryRoute && queryRoute?.length > 0 ? (
          queryRoute.map((ruta: any) => (
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
