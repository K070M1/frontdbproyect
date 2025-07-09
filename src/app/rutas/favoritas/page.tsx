"use client";

import { useGetRoutes } from "@/services/querys/routes.query";
import RouteCard from "@/components/Routes/RouteCard";
import styles from "./page.module.css";

export default function RutasFavoritasPage() {
  const { data: routes = [], isLoading, isError, error } = useGetRoutes();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1>Rutas Favoritas</h1>
        <p>Cargando rutas...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <h1>Rutas Favoritas</h1>
        <p style={{ color: "var(--danger)" }}>
          {(error as Error).message || "Error al cargar rutas"}
        </p>
      </div>
    );
  }

  // Filtrar sólo las rutas marcadas como favoritas
  const favoritas = routes.filter((ruta) => ruta.favorito);

  if (favoritas.length === 0) {
    return (
      <div className={styles.container}>
        <h1>Rutas Favoritas</h1>
        <p>No tienes rutas marcadas como favoritas.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Rutas Favoritas</h1>
      <div className={styles.grid}>
        {favoritas.map((ruta) => (
          <RouteCard
            key={ruta.id_ruta}
            origen={ruta.origen}
            destino={ruta.destino}
            riesgo={ruta.riesgo ?? 0}
            tiempo={ruta.tiempo_estimado ?? "N/A"}
            favorito={ruta.favorito}
          />
        ))}
      </div>
    </div>
  );
}
