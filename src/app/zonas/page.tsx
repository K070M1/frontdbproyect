"use client";
import { useState } from "react";
import LayoutShell from "@/components/Layout/LayoutShell";
import ZoneCard from "@/components/Zones/ZoneCard";
import SearchBar from "@/components/Behavior/SearchBar";
import Link from "next/link";
import styles from "./page.module.css";
import { useGetZones, useDeleteZone } from '@/services/querys/zone.query'
import { useSelectableList } from '@/hooks/useList'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import 'dayjs/locale/es';

// Mock data temporal para mostrar el diseño

export default function ZonasSegurasPage() {
  const [query, setQuery] = useState("");

  const { mutateAsync: deleteZone } = useDeleteZone();
  const { data: queryZones, refetch: refetchZones } = useGetZones();
  const listZones = useSelectableList(queryZones);

  // Filtrar zonas basado en la búsqueda
  const zonasFiltradas = listZones?.list.filter(
    (zona:any) =>
      zona?.nombre.toLowerCase().includes(query.toLowerCase()) ||
      zona?.descripcion.toLowerCase().includes(query.toLowerCase()) ||
      zona?.direccion?.toLowerCase().includes(query.toLowerCase())
  );

  const handledeleteZone = async (id: any) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción eliminará la zona segura permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteZone(id);
        if (!res) {
          Swal.fire(
            'Error',
            'No se pudo eliminar la zona segura. Inténtalo de nuevo más tarde.',
            'error'
          );
          return;
        }
        refetchZones();
        Swal.fire(
          'Eliminado!',
          'La zona segura ha sido eliminada.',
          'success'
        );
      }
    });
  }

  const handleEditZone = (id: any) => {
    
  }

  return (
    <LayoutShell>
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
          zonasFiltradas.map((zona:any) => (
            <ZoneCard  
              key={zona.id_zona}
              nombre={zona.nombre}
              descripcion={zona.descripcion}
              direccion={zona.direccion || ""}
              tipoPoligono={zona.forma || "polygon"}
              verificada={zona.verificada || false}
              area={zona.area_m2 || 0}
              perimetro={zona.perimeter_m || 0}
              coordenadas={zona.geojson || []}
              fechaCreacion={dayjs(zona.created_at).locale('es').format('DD [de] MMMM [de] YYYY') || ""}
              ultimaActualizacion={dayjs(zona.updated_at).locale('es').format('DD [de] MMMM [de] YYYY') || ""}
              onDelete={() => handledeleteZone(zona.id_zona)}
              onEdit={() => handleEditZone(zona.id_zona)}
            />
          ))
        ) : (
          <div className={styles.noResults}>
            <p>No hay zonas seguras que coincidan con tu búsqueda</p>
            <p
              style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.7 }}
            >
              Intenta con otros términos de búsqueda o registra una nueva zona
            </p>
          </div>
        )}
      </div>
    </LayoutShell>
  );
}
