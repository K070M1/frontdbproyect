import RouteCard from '@/components/Routes/RouteCard';
import { mockRutas } from '@/data/mockRutas';
import { mockUbicaciones } from '@/data/mockUbicaciones';
import styles from './ActiveRoutesList.module.css';

export default function ActiveRoutesList() {
  const getNombreUbicacion = (id: number) =>
    mockUbicaciones.find((u) => u.id_ubicacion === id)?.nombre || `Ubicación #${id}`;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Rutas Activas</h2>
      <div className={styles.grid}>
        {mockRutas.map((ruta) => (
          <RouteCard
            key={ruta.id_ruta}
            origen={getNombreUbicacion(ruta.id_origen)}
            destino={getNombreUbicacion(ruta.id_destino)}
            riesgo={ruta.riesgo}
            tiempo={ruta.tiempo_estimado}
            favorito={ruta.favorito}
          />
        ))}
      </div>
    </section>
  );
}
