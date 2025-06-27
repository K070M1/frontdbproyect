"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProfileDropdown from "@/components/UI/Profile/ProfileDropdown";
import NotificationDropdown from "@/components/UI/NotificationDropdown/NotificationDropdown";

import { FiMapPin } from "react-icons/fi";
import {
  FaSearch,
  // FaBell,
  FaRegUser,
  FaRoute,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaStar,
  FaCalendarAlt,
  FaCogs,
  FaBars,
  FaTimes,
  FaMapPin,
} from "react-icons/fa";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user } = useAuth();
  const isAdmin = user?.rol === "admin";
  const isLogged = !!user;
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <div className={styles.navWrapper}>
      <header className={styles.navbar}>
        {/* Logo */}
        <div className={styles.left}>
          <Link href={user ? "/dashboard" : "/"} className={styles.logo}>
            <FaRoute className={styles.logoIcon} />
            <span>TranquiRutas</span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Menú"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation */}
        <nav className={`${styles.center} ${menuOpen ? styles.menuOpen : ""}`}>
          <ul className={styles.menu}>
            {/* Mapa */}
            <li>
              <Link href="/public/mapa" className={styles.navLink}>
                <FaMapMarkedAlt className={styles.navIcon} />
                Mapa
              </Link>
            </li>

            {/* Rutas */}
            <li className={styles.hasSubmenu}>
              <span className={styles.navLink}>
                <FiMapPin className={styles.navIcon} />
                Rutas
              </span>
              <ul className={styles.submenu}>
                <li>
                  <small className={styles.submenuInfo}>
                    Explora y administra rutas seguras
                  </small>
                </li>
                <li><Link href="/rutas">Ver Todas</Link></li>
                {isLogged && <li><Link href="/rutas/favoritas">Favoritas</Link></li>}
                {isLogged && <li><Link href="/rutas/nueva">Nueva Ruta</Link></li>}
              </ul>
            </li>

            {/* Zonas */}
            <li className={styles.hasSubmenu}>
              <span className={styles.navLink}>
                <FaShieldAlt className={styles.navIcon} />
                Zonas
              </span>
              <ul className={styles.submenu}>
                <li>
                  <small className={styles.submenuInfo}>
                    Consulta zonas clasificadas como seguras
                  </small>
                </li>
                <li><Link href="/zonas">Zonas Seguras</Link></li>
              </ul>
            </li>

            {/* Ubicaciones */}
            {isLogged && (
              <li className={styles.hasSubmenu}>
                <span className={styles.navLink}>
                  <FaMapPin className={styles.navIcon} />
                  Ubicaciones
                </span>
                <ul className={styles.submenu}>
                  <li>
                    <small className={styles.submenuInfo}>
                      Tus ubicaciones registradas
                    </small>
                  </li>
                  <li><Link href="/ubicaciones">Ver Todas</Link></li>
                </ul>
              </li>
            )}

            {/* Calificaciones */}
            {isLogged && (
              <li className={styles.hasSubmenu}>
                <span className={styles.navLink}>
                  <FaStar className={styles.navIcon} />
                  Calificaciones
                </span>
                <ul className={styles.submenu}>
                  <li>
                    <small className={styles.submenuInfo}>
                      Evalúa rutas y zonas
                    </small>
                  </li>
                  <li><Link href="/calificaciones">Mis Calificaciones</Link></li>
                  <li><Link href="/calificaciones/nueva">Nueva Calificación</Link></li>
                </ul>
              </li>
            )}

            {/* Admin */}
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
              </>
            )}
          </ul>
        </nav>
        {/* Actions */}
        <div className={styles.right}>
          <button className={styles.iconButton} aria-label="Buscar">
            <FaSearch />
          </button>

          <NotificationDropdown />

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
