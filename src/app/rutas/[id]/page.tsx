"use client";
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from "next/navigation";

import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
// import BaseMap from "@/components/Map/BaseMap";
import RouteForm from "@/components/Routes/RouteForm";
import styles from "./page.module.css";
import { useGetRouteById } from "@/services/querys/routes.query";

export default function RutaDetallePage() {
  const { id } = useParams();
  const [ruta, setRuta] = useState(null);
  const searchParams = useSearchParams();
  const { mutateAsync: getRoute, isPending, error } = useGetRouteById();

  useEffect(() => {
    const fetchRoute = async () => {
      if (id) {
        const res = await getRoute(id);
        setRuta(res ? res : null);
      }
    }
    fetchRoute();
  }, [id, getRoute]);

  if (isPending) {
    return (
      <ProtectedRoute allowedRoles={["admin", "usuario"]}>
        <div className={styles.container}>
          <h1>Cargando ruta...</h1>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !ruta) {
    return (
      <ProtectedRoute allowedRoles={["admin", "usuario"]}>
        <div className={styles.container}>
          <h1>Ruta no encontrada</h1>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <div className={styles.container}>
        {ruta && (
          <>
            <h1 className="text-xl font-bold mb-4">Editar Ruta</h1>
            <RouteForm modoEdicion={true} datosIniciales={ruta} />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
