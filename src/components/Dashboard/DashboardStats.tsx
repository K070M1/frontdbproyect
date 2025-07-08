"use client";

import { useGetEvents } from '@/services/querys/event.query';
import { useGetZones } from '@/services/querys/zone.query';
import { useGetRoutes } from '@/services/querys/routes.query';
import { useGetCalifications } from '@/services/querys/calification.query';
import Card from '@/components/UI/Card/Card';
import styles from './DashboardStats.module.css';

export default function DashboardStats() {
  const { data: events, isLoading: loadingEvents } = useGetEvents();
  const { data: zones, isLoading: loadingZones } = useGetZones();
  const { data: routes, isLoading: loadingRoutes } = useGetRoutes();
  const { data: califications, isLoading: loadingCalifications } = useGetCalifications();

  const isLoading =
    loadingEvents ||
    loadingZones ||
    loadingRoutes ||
    loadingCalifications;

  const stats = [
    { label: 'Incidentes', value: events?.length ?? 0 },
    { label: 'Zonas Seguras', value: zones?.length ?? 0 },
    { label: 'Rutas Evaluadas', value: routes?.length ?? 0 },
    { label: 'Calificaciones', value: califications?.length ?? 0 },
  ];

  if (isLoading) {
    return <p>Cargando estadísticas...</p>;
  }

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
