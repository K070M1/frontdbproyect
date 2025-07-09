"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LayoutShell from "@/components/Layout/LayoutShell";
import BaseMap from "@/components/Map/BaseMap";
import RouteForm from "@/components/Routes/RouteForm";
import { getRouteById } from "@/services/querys/routes.query";
import styles from "./page.module.css";

export default function RutaDetallePage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";

  const [ruta, setRuta] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getRouteById(id as string);
      setRuta(res);
    };
    fetchData();
  }, [id]);

  if (!ruta) {
    return (
      <LayoutShell>
        <h1>Ruta no encontrada</h1>
      </LayoutShell>
    );
  }

  const origen = ruta.positions[0];
  const destino = ruta.positions[ruta.positions.length - 1];

  return (
    <LayoutShell>
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
            <BaseMap
              center={origen}
              zoom={15}
              markers={[origen, destino]}
              directions={ruta.directions || undefined}
            />
          </div>
        </>
      )}
    </LayoutShell>
  );
}
