"use client";

import { useParams, useSearchParams } from "next/navigation";
import BaseMap from "@/components/Map/BaseMap";
import RouteForm from "@/components/Routes/RouteForm";
import styles from "./page.module.css";
import { useGetRouteById } from "@/services/querys/routes.query";
// import { Ruta } from "@/types/entities/Ruta";

export default function RutaDetallePage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";

  const { data: ruta, isLoading, isError } = useGetRouteById(id as string);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1>Cargando ruta...</h1>
      </div>
    );
  }

  if (isError || !ruta) {
    return (
      <div className={styles.container}>
        <h1>Ruta no encontrada</h1>
      </div>
    );
  }

  const origen = ruta.positions?.[0];
  const destino = ruta.positions?.[ruta.positions.length - 1];

  return (
    <div className={styles.container}>
      {isEditing ? (
        <>
          <h1 className="text-xl font-bold mb-4">Editar Ruta</h1>
          <RouteForm modoEdicion={true} datosIniciales={ruta} />
        </>
      ) : (
        <>
          <h1 className={styles.title}>
            {ruta.origen} ➔ {ruta.destino}
          </h1>
          <p className={styles.info}>
            <strong>Riesgo:</strong> {ruta.riesgo}
          </p>
          <p className={styles.info}>
            <strong>Tiempo estimado:</strong> {ruta.tiempo_estimado}
          </p>
          {ruta.favorito && <p className={styles.favorite}>★ Ruta favorita</p>}

          <div className={styles.mapWrapper}>
            {origen && destino && (
              <BaseMap
                center={origen}
                zoom={15}
                markers={[origen, destino]}
                directions={ruta.directions || undefined}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
