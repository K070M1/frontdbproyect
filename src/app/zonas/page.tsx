"use client";

import { useState, useMemo } from "react";
import ZoneCard from "@/components/Zones/ZoneCard";
import SearchBar from "@/components/Behavior/SearchBar";
import Link from "next/link";
import styles from "./page.module.css";
import { useGetZones, useDeleteZone } from '@/services/querys/zone.query';
import { useRouter } from "next/navigation";
import { useSelectableList } from '@/hooks/useList';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import 'dayjs/locale/es';

export default function ZonasSegurasPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { data: zones = [], isLoading, isError, error, refetch: refetchZones } = useGetZones();
  const { mutateAsync: deleteZone } = useDeleteZone();
  const listZones = useSelectableList(zones);

  // Filtrar zonas basado en la búsqueda (normalize strings safely)
  const zonasFiltradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listZones.list;
    return listZones.list.filter((zona: any) => {
      const nombre = zona.nombre?.toLowerCase() ?? "";
      const desc = zona.descripcion?.toLowerCase() ?? "";
      const dir = zona.direccion?.toLowerCase() ?? "";
      return nombre.includes(q) || desc.includes(q) || dir.includes(q);
    });
  }, [query, listZones.list]);

  const handleDeleteZone = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará la zona segura permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await deleteZone(id);
      await refetchZones();
      Swal.fire('Eliminado!', 'La zona segura ha sido eliminada.', 'success');
    } catch {
      Swal.fire('Error', 'No se pudo eliminar la zona segura. Inténtalo de nuevo más tarde.', 'error');
    }
  };

  const handleEditZone = (id: number) => {
    router.push(`/zonas/${id}`);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p>Cargando zonas seguras...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <p>Error al cargar zonas: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Zonas Seguras</h1>

      <div className={styles.actions}>
        <Link href="/zonas/nueva" className={styles.addButton}>
          + Nueva Zona
        </Link>
      </div>

      <div className={styles.searchBar}>
        <SearchBar query={query} onQueryChange={setQuery} />
      </div>

      <div className={styles.list}>
        {zonasFiltradas.length > 0 ? (
          zonasFiltradas.map((zona: any) => (
            <ZoneCard
              key={zona.id_zona}
              nombre={zona.nombre}
              descripcion={zona.descripcion}
              direccion={zona.direccion || "—"}
              tipoPoligono={zona.forma || "polygon"}
              verificada={!!zona.verificada}
              area={Math.round(zona.area_m2) || 0}
              perimetro={Math.round(zona.perimeter_m) || 0}
              coordenadas={zona.geojson}
              fechaCreacion={dayjs(zona.created_at).locale('es').format('DD [de] MMMM [de] YYYY')}
              ultimaActualizacion={dayjs(zona.updated_at).locale('es').format('DD [de] MMMM [de] YYYY')}
              onDelete={() => handleDeleteZone(zona.id_zona)}
              onEdit={() => handleEditZone(zona.id_zona)}
            />
          ))
        ) : (
          <div className={styles.noResults}>
            <p>No hay zonas seguras que coincidan con tu búsqueda</p>
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.7 }}>
              Intenta con otros términos de búsqueda o registra una nueva zona
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
