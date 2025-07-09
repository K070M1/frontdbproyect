"use client";

import { useState } from "react";
import Link from "next/link";
import FilterPanel from "@/components/Behavior/FilterPanel";
import SearchBar from "@/components/Behavior/SearchBar";
import { useGetUbicaciones } from "@/services/querys/ubicacion.query";
import { Ubicacion } from "@/types/entities/Ubicacion";
import UbicacionCard from "@/components/Ubicaciones/UbicacionCard";
import styles from "./page.module.css";

export default function UbicacionesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");

  const riesgos = ["Todos", "Bajo", "Medio", "Alto"];
  const { data: ubicaciones = [], isLoading } = useGetUbicaciones();

  const filteredUbicaciones = ubicaciones.filter((u: Ubicacion) => {
    const matchNombre = u.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const matchRiesgo = activeFilter === "Todos" || u.riesgo === activeFilter;
    return matchNombre && matchRiesgo;
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ubicaciones</h1>

      <div className={styles.actions}>
        <Link href="/ubicaciones/nueva" className={styles.addButton}>
          + Nueva Ubicación
        </Link>
      </div>

      <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
      <FilterPanel
        filters={riesgos}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {isLoading ? (
        <p>Cargando ubicaciones...</p>
      ) : (
        <div className={styles.list}>
          {filteredUbicaciones.map((ubicacion) => (
            <div key={ubicacion.id_ubicacion}>
              <UbicacionCard
                nombre={ubicacion.nombre ?? "Sin nombre"}
                descripcion={ubicacion.descripcion ?? ""}
                riesgo={ubicacion.riesgo ?? "Medio"}
              />
              <div className={styles.buttons}>
                <Link
                  href={`/ubicaciones/${ubicacion.id_ubicacion}`}
                  className={styles.viewButton}
                >
                  Ver Detalle
                </Link>
                <Link
                  href={`/ubicaciones/${ubicacion.id_ubicacion}/editar`}
                  className={styles.editButton}
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
