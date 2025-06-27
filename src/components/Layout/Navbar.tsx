"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProfileDropdown from "@/components/UI/Profile/ProfileDropdown";
import NotificationDropdown from "@/components/UI/NotificationDropdown/NotificationDropdown";
import SearchInput from "@/components/UI/SearchInput/SearchInput";

import { FiMapPin } from "react-icons/fi";
import {
  FaRegUser,
  FaRoute,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaStar,
  FaCalendarAlt,
  FaCogs,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user } = useAuth();
  const isAdmin = user?.rol === "admin";
  const isLogged = Boolean(user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleSubmenu = (key: string) => {
    setOpenSubmenu((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <div className={styles.navWrapper}>
        <header className={styles.navbar}>
          {/* hamburguesa */}
          <button
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label="Menú"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* logo */}
          <div className={styles.left}>
            <Link href={user ? "/dashboard" : "/"} className={styles.logo}>
              <FaRoute className={styles.logoIcon} />
              <span>TranquiRutas</span>
            </Link>
          </div>

          {/* menú de escritorio y móvil */}
          <nav
            className={`${styles.center} ${menuOpen ? styles.menuOpen : ""}`}
          >
            <ul className={styles.menu}>
              <li>
                <Link href="/public/mapa" className={styles.navLink}>
                  <FaMapMarkedAlt className={styles.navIcon} />
                  Mapa
                </Link>
              </li>

              {/* Rutas */}
              <li
                className={`${styles.hasSubmenu} ${
                  openSubmenu === "rutas" ? styles.open : ""
                }`}
              >
                <span
                  className={styles.navLink}
                  onClick={() => toggleSubmenu("rutas")}
                >
                  <FiMapPin className={styles.navIcon} />
                  Rutas
                </span>
                <ul className={styles.submenu}>
                  <li>
                    <small className={styles.submenuInfo}>
                      Explora y administra rutas seguras
                    </small>
                  </li>
                  <li>
                    <Link href="/rutas">Ver Todas</Link>
                  </li>
                  {isLogged && (
                    <li>
                      <Link href="/rutas/favoritas">Favoritas</Link>
                    </li>
                  )}
                  {isLogged && (
                    <li>
                      <Link href="/rutas/nueva">Nueva Ruta</Link>
                    </li>
                  )}
                </ul>
              </li>

              {/* Zonas */}
              <li
                className={`${styles.hasSubmenu} ${
                  openSubmenu === "zonas" ? styles.open : ""
                }`}
              >
                <span
                  className={styles.navLink}
                  onClick={() => toggleSubmenu("zonas")}
                >
                  <FaShieldAlt className={styles.navIcon} />
                  Zonas
                </span>
                <ul className={styles.submenu}>
                  <li>
                    <small className={styles.submenuInfo}>
                      Consulta zonas clasificadas como seguras
                    </small>
                  </li>
                  <li>
                    <Link href="/zonas">Zonas Seguras</Link>
                  </li>
                </ul>
              </li>

              {/* Ubicaciones */}
              {isLogged && (
                <li
                  className={`${styles.hasSubmenu} ${
                    openSubmenu === "ubicaciones" ? styles.open : ""
                  }`}
                >
                  <span
                    className={styles.navLink}
                    onClick={() => toggleSubmenu("ubicaciones")}
                  >
                    <FaMapMarkedAlt className={styles.navIcon} />
                    Ubicaciones
                  </span>
                  <ul className={styles.submenu}>
                    <li>
                      <small className={styles.submenuInfo}>
                        Tus ubicaciones registradas
                      </small>
                    </li>
                    <li>
                      <Link href="/ubicaciones">Ver Todas</Link>
                    </li>
                  </ul>
                </li>
              )}

              {/* Calificaciones */}
              {isLogged && (
                <li
                  className={`${styles.hasSubmenu} ${
                    openSubmenu === "calificaciones" ? styles.open : ""
                  }`}
                >
                  <span
                    className={styles.navLink}
                    onClick={() => toggleSubmenu("calificaciones")}
                  >
                    <FaStar className={styles.navIcon} />
                    Calificaciones
                  </span>
                  <ul className={styles.submenu}>
                    <li>
                      <small className={styles.submenuInfo}>
                        Evalúa rutas y zonas
                      </small>
                    </li>
                    <li>
                      <Link href="/calificaciones">Mis Calificaciones</Link>
                    </li>
                    <li>
                      <Link href="/calificaciones/nueva">
                        Nueva Calificación
                      </Link>
                    </li>
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

          {/* acciones */}
          <div className={styles.right}>
            <SearchInput onSearch={(q) => console.log("Buscar:", q)} />
            <div className={styles.notificationContainer}>
              <NotificationDropdown />
            </div>
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

      {/* menú móvil de íconos */}
      {menuOpen && (
        <div className={styles.bottomNav}>
          {[
            { href: "/public/mapa", icon: <FaMapMarkedAlt />, label: "Mapa" },
            { href: "/rutas", icon: <FiMapPin />, label: "Rutas" },
            { href: "/zonas", icon: <FaShieldAlt />, label: "Zonas" },
            ...(isLogged
              ? [{ href: "/ubicaciones", icon: <FaMapMarkedAlt />, label: "Ubicaciones" }]
              : []),
            ...(isLogged
              ? [{ href: "/calificaciones", icon: <FaStar />, label: "Calificaciones" }]
              : []),
            ...(isAdmin
              ? [{ href: "/eventos", icon: <FaCalendarAlt />, label: "Eventos" }]
              : []),
            ...(isAdmin
              ? [{ href: "/configuracion", icon: <FaCogs />, label: "Configuración" }]
              : []),
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.bottomNavItem}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon}
              <span className={styles.bottomNavLabel}>{link.label}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
