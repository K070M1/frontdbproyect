"use client";

import { useState, useMemo } from "react";
import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import ZoneCard from "@/components/Zones/ZoneCard";
import SearchBar from "@/components/Behavior/SearchBar";
import Link from "next/link";
import styles from "./page.module.css";
import { useGetZones, useDeleteZone } from '@/services/querys/zone.query';
import { useRouter } from "next/navigation";
import { useSelectableList } from '@/hooks/useList';
import { useSocketStore } from '@/services/socket';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import 'dayjs/locale/es';
import { useAuth } from "@/context/AuthContext";

export default function ZonasSegurasPage() {
  const [query, setQuery] = useState("");
  const { sendSocket } = useSocketStore();
  const [activeFilter, setActiveFilter] = useState("Todas");
  const router = useRouter();
  const { user } = useAuth();

  const { data: zones = [], isLoading, isError, error, refetch: refetchZones } = useGetZones();
  const { mutateAsync: deleteZone } = useDeleteZone();
  const listZones = useSelectableList(zones);

  const zonasFiltradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtradas = [...listZones.list];

    if (q) {
      filtradas = filtradas.filter((zona: any) => {
        const nombre = zona.nombre?.toLowerCase() ?? "";
        const desc = zona.descripcion?.toLowerCase() ?? "";
        const dir = zona.direccion?.toLowerCase() ?? "";
        return nombre.includes(q) || desc.includes(q) || dir.includes(q);
      });
    }

    if (activeFilter !== "Todas") {
      filtradas = filtradas.filter((zona: any) => {
        if (activeFilter === "Zona Segura") return zona.inseguro === false;
        if (activeFilter === "Zona Insegura") return zona.inseguro === true;
        return true;
      });
    }

    return filtradas;
  }, [query, activeFilter, listZones.list]);

  const handleDeleteZone = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará la zona permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await deleteZone(id as any);
      await refetchZones();
      sendSocket({
        process: "changes_zone",
        action: "event",
        data: {
          response: `Zona ${id} eliminada`
        }
      })
      Swal.fire('Eliminado!', 'La zona ha sido eliminada.', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo eliminar la zona. Inténtalo de nuevo más tarde.', 'error');
    }
  };

  const handleEditZone = (id: number) => {
    router.push(`/zonas/${id}`);
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["admin", "usuario"]}>
        <div className={styles.container}>
          <p>Cargando zonas...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (isError) {
    return (
      <ProtectedRoute allowedRoles={["admin", "usuario"]}>
        <div className={styles.container}>
          <p>Error al cargar zonas: {(error as Error).message}</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <div className={styles.container}>
        <h1 className={styles.title}>Zonas</h1>

        <div className={styles.actions}>
          <div className={styles.filterSection}>
            <div className={styles.filterButtons}>
              {["Todas", "Zona Segura", "Zona Insegura"].map((filter) => (
                <button
                  key={filter}
                  className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ""}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <SearchBar query={query} onQueryChange={setQuery} />
          <Link href="/zonas/nueva" className={styles.addButton}>
            + Nueva Zona
          </Link>
        </div>

        <div className={styles.list}>
          {zonasFiltradas.length > 0 ? (
            zonasFiltradas.map((zona: any) => (
              <ZoneCard
                key={zona.id_zona}
                nombre={zona.nombre}
                descripcion={zona.descripcion}
                direccion={zona.direccion || "—"}
                inseguro={zona.inseguro || false}
                tipoPoligono={zona.forma || "polygon"}
                verificada={!!zona.verificada}
                area={zona.area_m2 || 0}
                perimetro={zona.perimeter_m || 0}
                coordenadas={zona.geojson}
                fechaCreacion={dayjs(zona.created_at).locale('es').format('DD [de] MMMM [de] YYYY')}
                ultimaActualizacion={dayjs(zona.updated_at).locale('es').format('DD [de] MMMM [de] YYYY')}
                onDelete={() => handleDeleteZone(zona.id_zona)}
                onEdit={() => handleEditZone(zona.id_zona)}
                id_usuario={zona.id_usuario}
                currentUserId={user?.id_usuario}
                rolUsuario={user?.rol ?? null}
              />
            ))
          ) : (
            <div className={styles.noResults}>
              <p>No hay zonas que coincidan con tu búsqueda</p>
              <p className={styles.noResultsHint}>
                Intenta con otros términos o ajusta los filtros
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
