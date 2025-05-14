"use client";

import Link from 'next/link';
import ProfileDropdown from '@/components/Profile/ProfileDropdown';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <h1 className={styles.logo}>
          <Link href="/">Rutas Seguras</Link>
        </h1>
      </div>

      <ul className={styles.menu}>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/rutas">Rutas</Link></li>
        <li><Link href="/zonas-seguras">Zonas</Link></li>
        <li><Link href="/eventos">Eventos</Link></li>
        <li><Link href="/calificaciones">Calificaciones</Link></li>
      </ul>

      <div className={styles.right}>
        <ProfileDropdown />
      </div>
    </nav>
  );
}
