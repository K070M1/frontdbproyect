import styles from './RouteCard.module.css';

type RouteCardProps = {
  origen: string;
  destino: string;
  riesgo: number;
  tiempo: string;
  favorito?: boolean;
};

export default function RouteCard({ origen, destino, riesgo, tiempo, favorito }: RouteCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>{origen} ➔ {destino}</div>
      <div className={styles.info}>Riesgo: {riesgo}</div>
      <div className={styles.info}>Tiempo estimado: {tiempo}</div>
      {favorito && <div className={styles.favorite}>★ Favorito</div>}
    </div>
  );
}
