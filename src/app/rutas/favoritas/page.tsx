"use client";


import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useGetRoutes } from "@/services/querys/routes.query";
import RouteCard from "@/components/Routes/RouteCard";
import styles from "../page.module.css";

export default function RutasFavoritasPage() {
  const { user } = useAuth();
  const { data: routes = [], isLoading, isError, error } = useGetRoutes();

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <div className={styles.container}>
        <h1>Rutas Favoritas</h1>
        <p>Cargando rutas...</p>
      </div>
      </ProtectedRoute>
    );
  }

  if (isError) {
    return (
      <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <div className={styles.container}>
        <h1>Rutas Favoritas</h1>
        <p style={{ color: "var(--danger)" }}>
          {(error as Error).message || "Error al cargar rutas"}
        </p>
      </div>
      </ProtectedRoute>
    );
  }

  // Filtrar sólo las rutas marcadas como favoritas
  // const favoritas = routes.filter((ruta) => ruta.favorito);
  const favoritas = routes.filter((ruta) => ruta.favorito && ruta.id_usuario === user?.id_usuario);

  if (favoritas.length === 0) {
    return (
      <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <div className={styles.container}>
        <h1>Rutas Favoritas</h1>
        <p>No tienes rutas marcadas como favoritas.</p>
      </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "moderador", "usuario"]}>
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
            id_usuario={ruta.id_usuario}
            currentUserId={user?.id_usuario}
            rolUsuario={user?.rol ?? undefined}
          />
        ))}
      </div>
    </div>
    </ProtectedRoute>
  );
}
