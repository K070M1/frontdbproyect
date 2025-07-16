"use client";

import { useGetCalifications } from "@/services/querys/calification.query";
import RatingStars from "./RatingStars";
import styles from "./RatingsList.module.css";

export default function RatingsList() {
  const {
    data: calificaciones = [],
    isLoading,
    isError,
    error,
  } = useGetCalifications();

  if (isLoading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Últimas Calificaciones</h2>
        <p>Cargando calificaciones...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Últimas Calificaciones</h2>
        <p style={{ color: "var(--danger)" }}>
          {(error as Error).message || "Error al cargar calificaciones"}
        </p>
      </section>
    );
  }

  if (calificaciones.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Últimas Calificaciones</h2>
        <p>No hay calificaciones disponibles.</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Últimas Calificaciones</h2>
      <div className={styles.grid}>
        {calificaciones.map((calif:any) => (
          <div key={calif.id_calificacion} className={styles.card}>
            <RatingStars score={calif.calificacion ?? 0} />

            <p>
              <strong>Usuario ID:</strong> {calif.usuarios?.nombre_usuario || "-"}
            </p>
            <p>
              <strong>Tipo:</strong> {calif.tipo_calificacion}
            </p>
            <p>
              <strong>Zona/Evento:</strong>{" "}
              {calif.id_zona
                ? `Zona #${calif.id_zona}`
                : calif.id_evento
                ? `Evento #${calif.id_evento}`
                : "N/A"}
            </p>

            <p className={styles.comment}>
              <em>&quot;{calif.comentario}&quot;</em>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
