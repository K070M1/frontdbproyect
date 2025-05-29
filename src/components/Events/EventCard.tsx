import { FaExclamationTriangle } from "react-icons/fa";
import styles from "./EventCard.module.css";

import { Evento } from "@/types/entities/Evento";
import { TipoEventoEnum } from "@/types/enums/TipoEvento";

type EventCardProps = {
  evento: Evento;
  tipoNombre: TipoEventoEnum;
};

export default function EventCard({ evento, tipoNombre }: EventCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <FaExclamationTriangle color="white" size={20} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{tipoNombre}</h3>
        <p className={styles.description}>{evento.descripcion}</p>
      </div>
    </div>
  );
}
