import { mockCalificaciones } from '@/data/mockCalificaciones';
import RatingStars from './RatingStars';
import styles from './RatingsList.module.css';

export default function RatingsList() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Últimas Calificaciones</h2>
      <div className={styles.grid}>
        {mockCalificaciones.map((calif) => (
          <div key={calif.id_calificacion} className={styles.card}>
            <RatingStars score={calif.calificacion} />

            <p><strong>Usuario ID:</strong> {calif.id_usuario}</p>
            <p><strong>Tipo:</strong> {calif.tipo_calificacion}</p>
            <p><strong>Zona/Eventos:</strong> 
              {calif.id_zona_segura ? `Zona #${calif.id_zona_segura}` : 
               calif.id_evento ? `Evento #${calif.id_evento}` : 'N/A'}
            </p>

            <p className={styles.comment}><em>&quot;{calif.comentario}&quot;</em></p>
          </div>
        ))}
      </div>
    </section>
  );
}
