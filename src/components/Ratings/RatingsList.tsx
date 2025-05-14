import { mockCalificaciones } from '@/data/mockCalificaciones';
import RatingStars from './RatingStars';
import styles from './RatingsList.module.css';

export default function RatingsList() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Últimas Calificaciones</h2>
      <div className={styles.grid}>
        {mockCalificaciones.map((rating) => (
          <div key={rating.id} className={styles.card}>
            <RatingStars score={rating.calificacion} />
            <p className={styles.comment}>{rating.comentario}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
