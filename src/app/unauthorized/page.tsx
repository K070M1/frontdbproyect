import Link from 'next/link';
import styles from './unauthorized.module.css';

export default function UnauthorizedPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🚫 Acceso Denegado</h1>
        <p className={styles.message}>
          No tienes permisos para acceder a esta página.
        </p>
        <Link href="/" className={styles.button}>Volver al inicio</Link>
      </div>
    </div>
  );
}
