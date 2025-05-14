import ZoneCard from '@/components/Zones/ZoneCard';
import { mockEstadisticas } from '@/data/mockEstadisticas';
import styles from './SafeZonesList.module.css';

export default function SafeZonesList() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Zonas Seguras</h2>
      <div className={styles.grid}>
        {mockEstadisticas.zonasMasSeguras.map((zone) => (
          <ZoneCard
            key={zone.nombre}
            nombre={zone.nombre}
            descripcion={`Nivel de seguridad: ${zone.nivelSeguridad}`}
          />
        ))}
      </div>
    </section>
  );
}
