import EventCard from '@/components/Events/EventCard';
import { mockEstadisticas } from '@/data/mockEstadisticas';
import styles from './EventsList.module.css';

export default function EventsList() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Últimos Eventos</h2>
      <div className={styles.grid}>
        {mockEstadisticas.incidentesPorDistrito.map((event) => (
          <EventCard
            key={event.distrito}
            tipo="Incidente"
            descripcion={`${event.distrito}: ${event.incidentes} reportes`}
          />
        ))}
      </div>
    </section>
  );
}
