import styles from './RouteCard.module.css';

type RouteCardProps = {
  origen: string;
  destino: string;
  riesgo: number;
  tiempo: string;
  favorito?: boolean;
};

const riesgoCategoria = (valor: number) => {
  if (valor <= 2) return { label: "Bajo", className: styles.riesgoBajo };
  if (valor <= 4) return { label: "Medio", className: styles.riesgoMedio };
  return { label: "Alto", className: styles.riesgoAlto };
};

export default function RouteCard({ origen, destino, riesgo, tiempo, favorito }: RouteCardProps) {
  const riesgoData = riesgoCategoria(riesgo);

  return (
    <div className={styles.card}>
      <div className={styles.header}>{origen} ➔ {destino}</div>
      <div className={`${styles.info} ${riesgoData.className}`}>Riesgo: {riesgoData.label}</div>
      <div className={styles.info}>Tiempo estimado: {tiempo}</div>
      {favorito && <div className={styles.favorite}>★ Favorito</div>}
    </div>
  );
}
