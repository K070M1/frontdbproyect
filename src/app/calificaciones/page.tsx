"use client";

import { useState } from "react";
import Link from "next/link";

import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import LayoutShell from "@/components/Layout/LayoutShell";
import RatingStars from "@/components/Ratings/RatingStars";
import FilterPanel from "@/components/Behavior/FilterPanel";
import SearchBar from "@/components/Behavior/SearchBar";
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useGetCalifications, useDeleteCalification } from "@/services/querys/calification.query";
import Swal from 'sweetalert2'
import { useAuth } from "@/context/AuthContext";

import styles from "./page.module.css";

export default function CalificacionesPage() {
  const { user } = useAuth();

  const { mutateAsync: deleteMutation } = useDeleteCalification();
  const { data: califications, isLoading } = useGetCalifications();
  const [activeFilter, setActiveFilter] = useState("todas");
  const [query, setQuery] = useState("");

  const filtros = [
    { label: "Todas", value: "todas" },
    { label: "Zona Segura", value: "zona_segura" },
    { label: "Ruta", value: "ruta" },
    { label: "Evento", value: "evento" },
  ];

  const calificacionesFiltradas = califications?.filter((calif: any) => {
    const matchesFiltro = activeFilter === "todas" || calif.tipo_calificacion === activeFilter;
    const matchesQuery = calif.comentario?.toLowerCase().includes(query.toLowerCase()) || false;
    const esPropia = user?.rol === "admin" || calif.id_usuario === user?.id_usuario;
    return matchesFiltro && matchesQuery && esPropia;
  }) || [];

  const handleDelete = async (id: any, comentario: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar esta calificación: "${comentario.substring(0, 50)}${comentario.length > 50 ? '...' : ''}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteMutation(id);
        if(res){
          Swal.fire({
            title: '¡Eliminado!',
            text: 'La calificación ha sido eliminada correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }else{
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar la calificación. Inténtalo de nuevo más tarde.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      }
    });
  };

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
          {isLoading ? (
            <div className={styles.loading}>Cargando calificaciones...</div>
          ) : calificacionesFiltradas.length === 0 ? (
            <div className={styles.empty}>No se encontraron calificaciones</div>
          ) : (
            calificacionesFiltradas.map((c: any) => (
              <div key={c.id_calificacion} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.ratingSection}>
                    <RatingStars score={c.calificacion || 0} />
                    <span className={styles.scoreText}>{c.calificacion || 0}/5</span>
                  </div>
                  <div className={styles.headerRight}>
                    <div className={styles.typeTag}>
                      {c.tipo_calificacion || 'Sin tipo'}
                    </div>
                  </div>
                </div>
                
                <div className={styles.cardBody}>
                  <div className={styles.comment}>
                    {c.comentario || 'Sin comentario'}
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <div className={styles.reference}>
                      <strong>Referencia:</strong> {
                        c.id_zona ? `Zona #${c.id_zona}` :
                        c.id_evento ? `Evento #${c.id_evento}` :
                        "No especificada"
                      }
                    </div>
                    <div className={styles.metadata}>
                      <span className={styles.userId}>Usuario: {c.id_usuario}</span>
                      <span className={styles.date}>
                        {new Date(c.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <Link 
                        href={`/calificaciones/${c.id_calificacion}`}
                        className={"p-2 flex flex-row gap-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"}
                        title="Editar calificación"
                      >
                        <FaEdit className="text-lg" />
                        <span>Editar</span>
                      </Link>
                      {(user?.rol === "admin" || c.id_usuario === user?.id_usuario) && (
                        <button
                          onClick={() => handleDelete(c.id_calificacion, c.comentario || '')}
                          className={"p-2 flex flex-row gap-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"}
                          title="Eliminar calificación"
                        >
                          <FaTrash className="text-lg" />
                          <span>Eliminar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </LayoutShell>
    </ProtectedRoute>
  );
}
