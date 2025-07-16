"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2'

import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import { useGetRoutes, useDeleteRoute } from "@/services/querys/routes.query";
import SearchBar from "@/components/Behavior/SearchBar";
import RouteCard from "@/components/Routes/RouteCard";
import { useSelectableList } from "@/hooks/useList";
import { Ruta } from "@/types/entities/Ruta";

import styles from "./page.module.css";
import { useAuth } from "@/context/AuthContext";

export default function RutasPage() {
  const router = useRouter();
  const { user } = useAuth();
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

    // Si es un usuario normal, solo mostrar sus propias rutas
    // if (user?.rol === "usuario") {
    //   filtered = filtered.filter((ruta) => ruta.id_usuario === user.id_usuario);
    // }

    if (searchQuery) {
      filtered = filtered.filter(
        (ruta: Ruta) =>
          ruta.origen?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ruta.destino?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilter !== "Todos") {
      if (activeFilter === "Favoritos") {
        filtered = filtered.filter((ruta: Ruta) => ruta.favorito);
      } else {
        filtered = filtered.filter((ruta: Ruta) => {
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
    router.push(`/rutas/${id}`);
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro de que deseas eliminar esta ruta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteRoute(id);
          if (res) {
            Swal.fire({
              title: 'Eliminado',
              text: 'La ruta ha sido eliminada correctamente.',
              icon: 'success'
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar la ruta. Inténtalo de nuevo más tarde.',
              icon: 'error',
            });
          }
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al eliminar la ruta. Por favor, inténtalo de nuevo más tarde.',
            icon: 'error'
          });
        }
      }
    });
  };

  if (!isMounted) return null;

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <div className={styles.container}>
        <h1 className={styles.title}>Rutas</h1>

        <div className={styles.actions}>
          <div className={styles.filterSection}>
            <div className={styles.filterButtons}>
              {["Todos", "Bajo", "Medio", "Alto", "Favoritos"].map((filter) => (
                <button
                  key={filter}
                  className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ""
                    }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter === "Favoritos" ? "⭐ " : ""}
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
          <Link href="/rutas/nueva" className={styles.addButton}>
            + Nueva Ruta
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredRoutes && filteredRoutes.length > 0 ? (
            filteredRoutes.map((ruta: Ruta) => (
              <RouteCard
                key={ruta.id_ruta}
                origen={ruta.origen}
                destino={ruta.destino}
                origenDireccion={ruta.origen_direccion}
                destinoDireccion={ruta.destino_direccion}
                riesgo={ruta.riesgo}
                tiempo={ruta.tiempo_estimado}
                favorito={ruta.favorito}
                onEdit={() => handleEdit(ruta.id_ruta)}
                onDelete={() => handleDelete(ruta.id_ruta)}
                currentUserId={user?.id_usuario}
                rolUsuario={user?.rol ?? undefined}
                id_usuario={ruta.id_usuario}
              />
            ))
          ) : (
            <div className={styles.noResults}>
              <p>No hay rutas que coincidan con tu búsqueda</p>
              <p className={styles.noResultsHint}>
                Intenta con otros términos de búsqueda o ajusta los filtros
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
