"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null; // Solo autenticados

  const isAdmin = user.rol === "admin";

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul>
          <li><Link href="/dashboard">Dashboard</Link></li>

          <li><Link href="/rutas">Rutas</Link></li>
          <li><Link href="/zonas">Zonas Seguras</Link></li>
          <li><Link href="/eventos">Eventos</Link></li>
          <li><Link href="/calificaciones">Calificaciones</Link></li>
          <li><Link href="/perfil">Perfil</Link></li>

          {isAdmin && <li><Link href="/configuracion">Configuración</Link></li>}
        </ul>
      </nav>
    </aside>
  );
}
