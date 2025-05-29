"use client";

import { useState } from "react";
import Link from "next/link";

import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import LayoutShell from "@/components/Layout/LayoutShell";
import RatingStars from "@/components/Ratings/RatingStars";
import FilterPanel from "@/components/Behavior/FilterPanel";
import SearchBar from "@/components/Behavior/SearchBar";

import { mockCalificaciones } from "@/data/mockCalificaciones";
import { useAuth } from "@/context/AuthContext";

import styles from "./page.module.css";

export default function CalificacionesPage() {
  const { user } = useAuth();

  const [activeFilter, setActiveFilter] = useState("todas");
  const [query, setQuery] = useState("");

  const filtros = [
    { label: "Todas", value: "todas" },
    { label: "Zona Segura", value: "zona_segura" },
    { label: "Ruta", value: "ruta" },
    { label: "Evento", value: "evento" },
  ];

  const calificacionesFiltradas = mockCalificaciones.filter((calif) => {
    const matchesFiltro = activeFilter === "todas" || calif.tipo_calificacion === activeFilter;
    const matchesQuery = calif.comentario.toLowerCase().includes(query.toLowerCase());
    const esPropia = user?.rol === "admin" || calif.id_usuario === user?.id_usuario;
    return matchesFiltro && matchesQuery && esPropia;
  });

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <LayoutShell>
        <h1 className={styles.title}>Calificaciones</h1>

        <div className={styles.actions}>
          <FilterPanel
            filters={filtros.map((f) => f.label)}
            activeFilter={filtros.find((f) => f.value === activeFilter)?.label || "Todas"}
            onFilterChange={(label) => {
              const selected = filtros.find((f) => f.label === label);
              if (selected) setActiveFilter(selected.value);
            }}
          />

          <SearchBar query={query} onQueryChange={setQuery} />

          {user?.rol === "admin" && (
            <Link href="/calificaciones/nueva" className={styles.addButton}>
              + Nueva Calificación
            </Link>
          )}
        </div>

        <div className={styles.list}>
          {calificacionesFiltradas.map((c) => (
            <div key={c.id_calificacion} className={styles.card}>
              <RatingStars score={c.calificacion} />
              <p><strong>ID Usuario:</strong> {c.id_usuario}</p>
              <p><strong>Tipo:</strong> {c.tipo_calificacion}</p>
              <p className={styles.comment}><em>{c.comentario}</em></p>
              <p className={styles.date}>Ref: {
                c.id_zona_segura ? `Zona #${c.id_zona_segura}` :
                c.id_evento ? `Evento #${c.id_evento}` :
                "No especificado"
              }</p>
            </div>
          ))}
        </div>
      </LayoutShell>
    </ProtectedRoute>
  );
}
