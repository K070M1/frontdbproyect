"use client";

import { useGetZones } from '@/services/querys/zone.query';
import ZoneCard from '@/components/Zones/ZoneCard';
import styles from './SafeZonesList.module.css';

export default function SafeZonesList() {
  const {
    data: zones = [],
    isLoading,
    isError,
    error,
  } = useGetZones();

  if (isLoading) {
    return <p>Cargando zonas seguras...</p>;
  }

  if (isError) {
    return <p>Error al cargar zonas: {(error as Error).message}</p>;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Zonas Seguras</h2>
      <div className={styles.grid}>
        {zones.map((zone: any) => (
          <ZoneCard
            key={zone.id_zona}
            nombre={zone.nombre}
            descripcion={zone.descripcion}
            inseguro={zone.inseguro || false}
          />
        ))}
      </div>
    </section>
  );
}
