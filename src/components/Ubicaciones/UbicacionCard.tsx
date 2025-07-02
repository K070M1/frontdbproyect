import { Ubicacion } from "@/types/entities/Ubicacion";
import styles from "./UbicacionCard.module.css";

type UbicacionCardProps = Pick<Ubicacion, "nombre" | "descripcion" | "riesgo">;

const riesgoEstilos = {
  Bajo: {
    clase: styles.riesgoBajo,
    etiqueta: "Bajo Riesgo",
  },
  Medio: {
    clase: styles.riesgoMedio,
    etiqueta: "Riesgo Medio",
  },
  Alto: {
    clase: styles.riesgoAlto,
    etiqueta: "Alto Riesgo",
  },
};

export default function UbicacionCard({
  nombre,
  descripcion,
  riesgo,
}: UbicacionCardProps) {
  const riesgoInfo = riesgoEstilos[riesgo as keyof typeof riesgoEstilos] || {
    clase: styles.riesgoMedio,
    etiqueta: "Riesgo Desconocido",
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.nombre}>{nombre}</h2>
      <p className={styles.descripcion}>
        {descripcion || "Sin descripción disponible"}
      </p>
      <span className={`${styles.riesgoBadge} ${riesgoInfo.clase}`}>
        {riesgoInfo.etiqueta}
      </span>
    </div>
  );
}
