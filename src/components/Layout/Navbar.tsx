"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProfileDropdown from "@/components/Profile/ProfileDropdown";
import { FaRoute, FaRegUser } from 'react-icons/fa'
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user } = useAuth();
  const isAdmin = user?.rol === "admin";
  const isLogged = !!user;

  return (
    <div className="w-full flex justify-center py-2">
      <header className={`${styles.navbar} max-w-7xl! w-[90%]! rounded-full border backdrop-blur-md! shadow-md!`}>
        <div className={styles.left}>
          <Link href="/" className={`${styles.logo} flex flex-row gap-2 items-center`}>
            <FaRoute className="size-6" />
            TranquiRutas
          </Link>
        </div>

        <nav className={styles.center}>
          <ul className={styles.menu}>
            <li>
              <Link href="/public/mapa">Mapa</Link>
            </li>

            <li className={styles.hasSubmenu}>
              <span>Rutas</span>
              <ul className={styles.submenu}>
                <li><Link href="/rutas">Ver Todas</Link></li>
                {isLogged && <li><Link href="/rutas/favoritas">Favoritas</Link></li>}
                {isLogged && <li><Link href="/rutas/nueva">Nueva Ruta</Link></li>}
              </ul>
            </li>

            <li className={styles.hasSubmenu}>
              <span>Zonas</span>
              <ul className={styles.submenu}>
                <li><Link href="/zonas">Zonas Seguras</Link></li>
              </ul>
            </li>

            {isLogged && (
              <li className={styles.hasSubmenu}>
                <span>Ubicaciones</span>
                <ul className={styles.submenu}>
                  <li><Link href="/ubicaciones">Ver Todas</Link></li>
                </ul>
              </li>
            )}

            {isLogged && (
              <li className={styles.hasSubmenu}>
                <span>Calificaciones</span>
                <ul className={styles.submenu}>
                  <li><Link href="/calificaciones">Mis Calificaciones</Link></li>
                  <li><Link href="/calificaciones/nueva">Nueva Calificación</Link></li>
                </ul>
              </li>
            )}

            {isAdmin && (
              <>
                <li><Link href="/eventos">Eventos</Link></li>
                <li><Link href="/configuracion">Configuración</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
              </>
            )}
          </ul>
        </nav>

        <div className={styles.right}>
          {user ? (
            <ProfileDropdown />
          ) : (
            <Link href="/auth/login" className={`${styles.loginButton} flex flex-row gap-2 items-center`}>
              <FaRegUser className="size-4"/>
              Iniciar Sesión
            </Link>
          )}
        </div>
      </header>
    </div>
  );
}
