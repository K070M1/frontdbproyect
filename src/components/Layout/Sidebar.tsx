import Link from 'next/link';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul>
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li><Link href="/rutas">Rutas</Link></li>
          <li><Link href="/zonas-seguras">Zonas Seguras</Link></li>
          <li><Link href="/eventos">Eventos</Link></li>
          <li><Link href="/calificaciones">Calificaciones</Link></li>
          <li><Link href="/perfil">Perfil</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
