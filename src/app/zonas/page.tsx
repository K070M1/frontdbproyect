"use client";
import { useState } from "react";
import LayoutShell from "@/components/Layout/LayoutShell";
import ZoneCard from "@/components/Zones/ZoneCard";
import FilterPanel from "@/components/Behavior/FilterPanel";
import SearchBar from "@/components/Behavior/SearchBar";
import Link from "next/link";
import styles from "./page.module.css";

// Mock data temporal para mostrar el diseño
const mockZonas = [
  {
    id: 1,
    nombre: "Hospital Nacional - San Isidro",
    descripcion:
      "Hospital nacional con vigilancia 24/7, área segura con personal de seguridad permanente y acceso controlado.",
    direccion: "Av. Javier Prado Este 3042, San Isidro",
    tipoPoligono: "circle" as const,
    verificada: true,
    area: "3.2 km²",
    perimetro: "7.1 km",
    coordenadas: "-12.0894, -77.0228",
    fechaCreacion: "10 de Enero, 2024",
    ultimaActualizacion: "Hace 3 horas",
  },
  {
    id: 2,
    nombre: "Comisaría de Miraflores",
    descripcion:
      "Estación de policía con atención las 24 horas. Zona altamente segura con patrullaje constante.",
    direccion: "Av. José Larco 240, Miraflores",
    tipoPoligono: "rectangle" as const,
    verificada: true,
    area: "1.8 km²",
    perimetro: "5.4 km",
    coordenadas: "-12.1219, -77.0296",
    fechaCreacion: "15 de Febrero, 2024",
    ultimaActualizacion: "Hace 1 día",
  },
  {
    id: 3,
    nombre: "Centro Comercial Jockey Plaza",
    descripcion:
      "Centro comercial con múltiples salidas de emergencia, seguridad privada y cámaras de vigilancia.",
    direccion: "Av. Javier Prado Este 4200, Surco",
    tipoPoligono: "polygon" as const,
    verificada: false,
    area: "4.5 km²",
    perimetro: "8.9 km",
    coordenadas: "-12.0855, -76.9767",
    fechaCreacion: "20 de Marzo, 2024",
    ultimaActualizacion: "Hace 5 días",
  },
  {
    id: 4,
    nombre: "Universidad de Lima",
    descripcion:
      "Campus universitario con control de acceso, seguridad interna y áreas de refugio designadas.",
    direccion: "Av. Javier Prado Este, Santiago de Surco",
    tipoPoligono: "rectangle" as const,
    verificada: true,
    area: "2.1 km²",
    perimetro: "6.2 km",
    coordenadas: "-12.0841, -76.9711",
    fechaCreacion: "5 de Enero, 2024",
    ultimaActualizacion: "Hace 12 horas",
  },
];

export default function ZonasSegurasPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [query, setQuery] = useState("");

  // Filtrar zonas basado en la búsqueda
  const zonasFiltradas = mockZonas.filter(
    (zona) =>
      zona.nombre.toLowerCase().includes(query.toLowerCase()) ||
      zona.descripcion.toLowerCase().includes(query.toLowerCase()) ||
      zona.direccion?.toLowerCase().includes(query.toLowerCase())
  );

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

      <FilterPanel
        filters={["Todos", "Verificadas", "Por verificar"]}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className={styles.list}>
        {zonasFiltradas.length > 0 ? (
          zonasFiltradas.map((zona) => (
            <ZoneCard
              key={zona.id}
              nombre={zona.nombre}
              descripcion={zona.descripcion}
              direccion={zona.direccion}
              tipoPoligono={zona.tipoPoligono}
              verificada={zona.verificada}
              area={zona.area}
              perimetro={zona.perimetro}
              coordenadas={zona.coordenadas}
              fechaCreacion={zona.fechaCreacion}
              ultimaActualizacion={zona.ultimaActualizacion}
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
