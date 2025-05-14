import RouteCard from '@/components/Routes/RouteCard';
import { mockRutas } from '@/data/mockRutas';
import styles from './ActiveRoutesList.module.css';

export default function ActiveRoutesList() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Rutas Activas</h2>
      <div className={styles.grid}>
        {mockRutas.map((ruta) => (
          <RouteCard
            key={ruta.id_ruta}
            origen={ruta.origen}
            destino={ruta.destino}
            riesgo={ruta.riesgo}
            tiempo={ruta.tiempo_estimado}
            favorito={ruta.favorito}
          />
        ))}
      </div>
    </section>
  );
}
