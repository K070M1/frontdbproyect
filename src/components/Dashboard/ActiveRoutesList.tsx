"use client";

import RouteCard from "@/components/Routes/RouteCard";
import styles from "./ActiveRoutesList.module.css";
import { useGetRoutes } from "@/services/querys/routes.query";

export default function ActiveRoutesList() {
  const { data: routes = [], isLoading, isError, error } = useGetRoutes();

  if (isLoading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Rutas Activas</h2>
        <p>Cargando rutas...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Rutas Activas</h2>
        <p style={{ color: "var(--danger)" }}>
          {(error as Error).message || "Error al cargar rutas"}
        </p>
      </section>
    );
  }

  if (routes.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Rutas Activas</h2>
        <p>No hay rutas activas disponibles.</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Rutas Activas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {routes.map((ruta) => (
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
    </section>
  );
}
