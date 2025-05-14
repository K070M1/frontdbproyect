import Card from '@/components/UI/Card/Card';
import { mockEstadisticas } from '@/data/mockEstadisticas';
import styles from './DashboardStats.module.css';

export default function DashboardStats() {
  const stats = [
    { label: 'Incidentes', value: mockEstadisticas.totalIncidentes },
    { label: 'Zonas Seguras', value: mockEstadisticas.zonasSegurasRegistradas },
    { label: 'Rutas Evaluadas', value: mockEstadisticas.rutasEvaluadas },
    { label: 'Calificaciones', value: mockEstadisticas.calificacionesTotales },
  ];

  return (
    <section className={styles.grid}>
      {stats.map((stat) => (
        <Card key={stat.label}>
          <h3>{stat.value}</h3>
          <p>{stat.label}</p>
        </Card>
      ))}
    </section>
  );
}
