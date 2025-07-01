"use client";

import { useState } from "react";
import Link from "next/link";
import LayoutShell from "@/components/Layout/LayoutShell";
import FilterPanel from "@/components/Behavior/FilterPanel";
import SearchBar from "@/components/Behavior/SearchBar";
import styles from "./page.module.css";

export default function UbicacionesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");

  const riesgos = ["Todos", "Bajo", "Medio", "Alto"];

  const filteredUbicaciones:any = []

  return (
    <LayoutShell>
      <h1 className={styles.title}>Ubicaciones</h1>

      <div className={styles.actions}>
        <Link href="/ubicaciones/nueva" className={styles.addButton}>
          + Nueva Ubicación
        </Link>
      </div>

      <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
      <FilterPanel filters={riesgos} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className={styles.list}>
        {filteredUbicaciones.map((ubicacion:any) => (
          <div key={ubicacion.id} className={styles.card}>
            <h2>{ubicacion.nombre}</h2>
            <p>{ubicacion.descripcion}</p>
            <p><strong>Riesgo:</strong> {ubicacion.riesgo}</p>

            <div className={styles.buttons}>
              <Link href={`/ubicaciones/${ubicacion.id}`} className={styles.viewButton}>
                Ver Detalle
              </Link>
              <Link href={`/ubicaciones/${ubicacion.id}/editar`} className={styles.editButton}>
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </LayoutShell>
  );
}
