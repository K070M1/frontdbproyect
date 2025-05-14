"use client";

import Link from "next/link";
import LayoutShell from "@/components/Layout/LayoutShell";
import { mockUbicaciones } from "@/data/mockUbicaciones";
import { mockCalificaciones } from "@/data/mockCalificaciones";
import styles from "./page.module.css";
import { FaStar, FaRegStar } from "react-icons/fa";

function getCalificacionZona(nombre: string): number | null {
  const califs = mockCalificaciones.filter(
    (c) => c.tipo === "zona_segura" && c.referencia.includes(nombre)
  );

  if (califs.length === 0) return null;

  const promedio = califs.reduce((acc, c) => acc + c.calificacion, 0) / califs.length;
  return Math.round(promedio);
}

export default function UbicacionesPage() {
  return (
    <LayoutShell>
      <h1 className={styles.title}>Ubicaciones</h1>

      <div className={styles.actions}>
        <Link href="/ubicaciones/nueva" className={styles.addButton}>
          + Nueva Ubicación
        </Link>
      </div>

      <div className={styles.list}>
        {mockUbicaciones.map((ubicacion) => {
          const calificacion = getCalificacionZona(ubicacion.nombre);

          return (
            <div key={ubicacion.id} className={styles.card}>
              <h2>{ubicacion.nombre}</h2>
              <p>{ubicacion.descripcion}</p>

              {calificacion !== null && (
                <div>
                  {Array.from({ length: 5 }, (_, i) =>
                    i < calificacion ? (
                      <FaStar key={i} color="#fbbf24" />
                    ) : (
                      <FaRegStar key={i} color="#d1d5db" />
                    )
                  )}
                </div>
              )}

              <div className={styles.buttons}>
                <Link href={`/ubicaciones/${ubicacion.id}`} className={styles.viewButton}>
                  Ver Detalle
                </Link>
                <Link href={`/ubicaciones/${ubicacion.id}/editar`} className={styles.editButton}>
                  Editar
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </LayoutShell>
  );
}
