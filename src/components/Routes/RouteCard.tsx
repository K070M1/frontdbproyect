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
};

const riesgoCategoria = (valor: number) => {
  if (valor <= 2)
    return {
      label: "Bajo Riesgo",
      className: styles.riesgoBajo,
      icon: "🟢",
    };
  if (valor <= 4)
    return {
      label: "Riesgo Medio",
      className: styles.riesgoMedio,
      icon: "🟡",
    };
  return {
    label: "Alto Riesgo",
    className: styles.riesgoAlto,
    icon: "🔴",
  };
};

const formatTime = (tiempo: string) => {
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
  riesgo,
  tiempo,
  favorito,
  onEdit,
  onDelete,
}: RouteCardProps) {
  const riesgoData = riesgoCategoria(riesgo);
  const formattedTime = formatTime(tiempo);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.routeDirection}>
          <div className={styles.header}>
            <span>{origen}</span>
            <span className={styles.arrow}>→</span>
            <span>{destino}</span>
          </div>
          <div className={styles.locations}>
            <div className={styles.location}>
              <div className={`${styles.locationIcon} ${styles.origin}`}></div>
              <span>Desde: {origen}</span>
            </div>
            <div className={styles.location}>
              <div
                className={`${styles.locationIcon} ${styles.destination}`}
              ></div>
              <span>Hasta: {destino}</span>
            </div>
          </div>
        </div>
        {favorito && <div className={styles.favorite}>★</div>}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.riskContainer}>
          <span className={styles.riskLabel}>Nivel de Riesgo</span>
          <div className={`${styles.riskBadge} ${riesgoData.className}`}>
            <div className={styles.riskIcon}></div>
            {riesgoData.label}
          </div>
        </div>

        <div className={styles.timeContainer}>
          <span className={styles.timeLabel}>Tiempo Estimado</span>
          <div className={styles.timeValue}>{formattedTime}</div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.actionButtons}>
          <button className={styles.editButton} onClick={onEdit}>
            ✏️ Editar
          </button>
          <button className={styles.deleteButton} onClick={onDelete}>
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
