"use client";
import { useGetRoutes, useDeleteRoute } from "@/services/querys/routes.query";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LayoutShell from "@/components/Layout/LayoutShell";
import FilterPanel from "@/components/Behavior/FilterPanel";
import SearchBar from "@/components/Behavior/SearchBar";
import RouteCard from "@/components/Routes/RouteCard";
import styles from "./page.module.css";
import { useSelectableList } from "@/hooks/useList";

export default function RutasPage() {
  const router = useRouter();
  const { data: queryRoute } = useGetRoutes();
  const { mutateAsync: deleteRoute } = useDeleteRoute();
  const { list, active, setActive, setById } = useSelectableList(queryRoute);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredRoutes = useMemo(() => {
    if (!queryRoute) return [];

    let filtered = [...queryRoute];

    // Filtro por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (ruta: any) =>
          ruta.origen.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ruta.destino.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por nivel de riesgo o favoritos
    if (activeFilter !== "Todos") {
      if (activeFilter === "Favoritos") {
        filtered = filtered.filter((ruta: any) => ruta.favorito);
      } else {
        filtered = filtered.filter((ruta: any) => {
          const riesgo = ruta.riesgo;
          if (activeFilter === "Bajo") return riesgo <= 2;
          if (activeFilter === "Medio") return riesgo > 2 && riesgo <= 4;
          if (activeFilter === "Alto") return riesgo > 4;
          return true;
        });
      }
    }

    return filtered;
  }, [queryRoute, searchQuery, activeFilter]);

  const handleEdit = (id: number) => {
    router.push(`/rutas/editar/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta ruta?")) {
      try {
        await deleteRoute(id);
      } catch (error) {
        console.error("Error al eliminar la ruta:", error);
      }
    }
  };

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

      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          {["Todos", "Bajo", "Medio", "Alto", "Favoritos"].map((filter) => (
            <button
              key={filter}
              className={`${styles.filterButton} ${
                activeFilter === filter ? styles.active : ""
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === "Favoritos" ? "⭐ " : ""}
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredRoutes && filteredRoutes.length > 0 ? (
          filteredRoutes.map((ruta: any) => (
            <RouteCard
              key={ruta.id_ruta}
              origen={ruta?.origen}
              destino={ruta?.destino}
              origenDireccion={ruta?.origen_direccion}
              destinoDireccion={ruta?.destino_direccion}
              riesgo={ruta.riesgo}
              tiempo={ruta.tiempo_estimado}
              favorito={ruta.favorito}
              onEdit={() => handleEdit(ruta.id_ruta)}
              onDelete={() => handleDelete(ruta.id_ruta)}
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
