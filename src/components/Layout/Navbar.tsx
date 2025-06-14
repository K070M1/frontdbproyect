"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProfileDropdown from "@/components/Profile/ProfileDropdown";
import {
  FaSearch,
  FaBell,
  FaRegUser,
  FaRoute,
  FaMapMarkedAlt,
  FaExchangeAlt,
  FaShieldAlt,
  FaMapPin,
  FaStar,
  FaCalendarAlt,
  FaCogs,
  // FaChartBar,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user } = useAuth();
  const isAdmin = user?.rol === "admin";
  const isLogged = !!user;
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className={styles.navWrapper}>
      <header className={`${styles.navbar} shadow-md!`}>
        <div className={styles.left}>
          <Link href={user ? "/dashboard" : "/"} className={styles.logo}>
            <FaRoute className={styles.logoIcon} />
            <span>TranquiRutas</span>
          </Link>
        </div>

        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Menú">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`${styles.center} ${menuOpen ? styles.menuOpen : ""}`}>
          <ul className={styles.menu}>
            <li>
              <Link href="/public/mapa" className={styles.navLink}>
                <FaMapMarkedAlt className={styles.navIcon} />
                Mapa
              </Link>
            </li>

            <li className={styles.hasSubmenu}>
              <span className={styles.navLink}>
                <FaExchangeAlt className={styles.navIcon} />
                Rutas
              </span>
              <ul className={styles.submenu}>
                <li><Link href="/rutas">Ver Todas</Link></li>
                {isLogged && <li><Link href="/rutas/favoritas">Favoritas</Link></li>}
                {isLogged && <li><Link href="/rutas/nueva">Nueva Ruta</Link></li>}
              </ul>
            </li>

            <li className={styles.hasSubmenu}>
              <span className={styles.navLink}>
                <FaShieldAlt className={styles.navIcon} />
                Zonas
              </span>
              <ul className={styles.submenu}>
                <li><Link href="/zonas">Zonas Seguras</Link></li>
              </ul>
            </li>

            {isLogged && (
              <li className={styles.hasSubmenu}>
                <span className={styles.navLink}>
                  <FaMapPin className={styles.navIcon} />
                  Ubicaciones
                </span>
                <ul className={styles.submenu}>
                  <li><Link href="/ubicaciones">Ver Todas</Link></li>
                </ul>
              </li>
            )}

            {isLogged && (
              <li className={styles.hasSubmenu}>
                <span className={styles.navLink}>
                  <FaStar className={styles.navIcon} />
                  Calificaciones
                </span>
                <ul className={styles.submenu}>
                  <li><Link href="/calificaciones">Mis Calificaciones</Link></li>
                  <li><Link href="/calificaciones/nueva">Nueva Calificación</Link></li>
                </ul>
              </li>
            )}

            {isAdmin && (
              <>
                <li>
                  <Link href="/eventos" className={styles.navLink}>
                    <FaCalendarAlt className={styles.navIcon} />
                    Eventos
                  </Link>
                </li>
                <li>
                  <Link href="/configuracion" className={styles.navLink}>
                    <FaCogs className={styles.navIcon} />
                    Configuración
                  </Link>
                </li>
                {/* <li>
                  <Link href="/dashboard" className={styles.navLink}>
                    <FaChartBar className={styles.navIcon} />
                    Dashboard
                  </Link>
                </li> */}
              </>
            )}
          </ul>
        </nav>

        <div className={styles.right}>
          <button className={styles.iconButton} aria-label="Buscar">
            <FaSearch />
          </button>
          <button className={styles.iconButton} aria-label="Notificaciones">
            <FaBell />
          </button>
          {user ? (
            <ProfileDropdown />
          ) : (
            <Link href="/auth/login" className={styles.loginButton}>
              <FaRegUser className={styles.userIcon} />
              Iniciar Sesión
            </Link>
          )}
        </div>
      </header>
    </div>
  );
}
