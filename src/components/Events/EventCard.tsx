import { FaExclamationTriangle } from "react-icons/fa";
import styles from "./EventCard.module.css";

type EventCardProps = {
  tipo: string;
  descripcion: string;
};

export default function EventCard({ tipo, descripcion }: EventCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <FaExclamationTriangle color="white" size={20} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{tipo}</h3>
        <p className={styles.description}>{descripcion}</p>
      </div>
    </div>
  );
}
