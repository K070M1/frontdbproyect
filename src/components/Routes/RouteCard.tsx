import { FaEdit, FaTrash } from "react-icons/fa";
import styles from "./RouteCard.module.css";

type RouteCardProps = {
  origen: string;
  destino: string;
  origenDireccion?: string;
  destinoDireccion?: string;
  riesgo: number;
  tiempo: string;
  favorito?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  id_usuario?: number;         // ← ID del creador de la ruta
  currentUserId?: number;      // ← ID del usuario logueado
  rolUsuario?: string;         // ← 'admin' | 'usuario'
};

const riesgoCategoria = (valor: number) => {
  if (valor <= 2)
    return {
      label: "BAJO RIESGO",
      className: styles.riesgoBajo,
      dotClass: styles.dotBajo,
    };
  if (valor <= 4)
    return {
      label: "RIESGO MEDIO",
      className: styles.riesgoMedio,
      dotClass: styles.dotMedio,
    };
  return {
    label: "ALTO RIESGO",
    className: styles.riesgoAlto,
    dotClass: styles.dotAlto,
  };
};

const formatTime = (tiempo: string) => {
  if (!tiempo) return "--";
  const parts = tiempo.split(":");
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export default function RouteCard({
  origen,
  destino,
  origenDireccion,
  destinoDireccion,
  riesgo,
  tiempo,
  favorito,
  onEdit,
  onDelete,
  id_usuario,
  currentUserId,
  rolUsuario,
}: RouteCardProps) {
  const riesgoData = riesgoCategoria(riesgo);
  const formattedTime = formatTime(tiempo);
  const puedeEditar = rolUsuario === "admin" || currentUserId === id_usuario;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.routeTitle}>
          <span className={styles.routeText}>
            {origen} <span className={styles.arrow}>→</span> {destino}
          </span>
        </div>
        {favorito && <span className={styles.favoriteStar}>⭐</span>}
      </div>

      <div className={styles.routeDetails}>
        <div className={styles.locationItem}>
          <div className={styles.locationDot}></div>
          <div className={styles.locationContent}>
            <span className={styles.locationLabel}>Desde: {origen}</span>
            {origenDireccion && (
              <span className={styles.locationAddress}>{origenDireccion}</span>
            )}
          </div>
        </div>

        <div className={styles.locationItem}>
          <div
            className={`${styles.locationDot} ${styles.destinationDot}`}
          ></div>
          <div className={styles.locationContent}>
            <span className={styles.locationLabel}>Hasta: {destino}</span>
            {destinoDireccion && (
              <span className={styles.locationAddress}>{destinoDireccion}</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.cardMetrics}>
        <div className={styles.metricGroup}>
          <span className={styles.metricTitle}>NIVEL DE RIESGO</span>
          <div className={`${styles.riskBadge} ${riesgoData.className}`}>
            <span className={riesgoData.dotClass}>●</span>
            <span>{riesgoData.label}</span>
          </div>
        </div>

        <div className={styles.metricGroup}>
          <span className={styles.metricTitle}>TIEMPO ESTIMADO</span>
          <div className={styles.timeBadge}>{formattedTime}</div>
        </div>
      </div>
      {puedeEditar && (
        <div className={styles.actionButtons}>
          <button className={styles.editButton} onClick={onEdit}>
            <FaEdit /> Editar
          </button>
          <button className={styles.deleteButton} onClick={onDelete}>
            <FaTrash /> Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
