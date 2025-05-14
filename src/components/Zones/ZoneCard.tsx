import styles from './ZoneCard.module.css';

type ZoneCardProps = {
  nombre: string;
  descripcion: string;
};

export default function ZoneCard({ nombre, descripcion }: ZoneCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{nombre}</h3>
      <p className={styles.description}>{descripcion}</p>
    </div>
  );
}
