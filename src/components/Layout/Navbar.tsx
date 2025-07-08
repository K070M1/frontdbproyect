"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProfileDropdown from "@/components/UI/Profile/ProfileDropdown";
// import NotificationDropdown from "@/components/UI/NotificationDropdown/NotificationDropdown";
// import SearchInput from "@/components/UI/SearchInput/SearchInput";

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
import ThemeToggle from "../Utils/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
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
          <button
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label="Menú"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div className={styles.left}>
            <Link href={user ? "/dashboard" : "/"} className={styles.logo}>
              <FaRoute className={styles.logoIcon} />
              <span>TranquiRutas</span>
            </Link>
          </div>

          <nav className={`${styles.center} ${menuOpen ? styles.menuOpen : ""}`}>
            <ul className={styles.menu}>
              <li>
                <Link
                  href="/mapa"
                  className={`${styles.navLink} ${pathname === "/mapa" ? styles.active : ""}`}
                >
                  <FaMapMarkedAlt className={styles.navIcon} />
                  Mapa
                </Link>
              </li>

              {/* Rutas */}
              <li
                className={`${styles.hasSubmenu} ${openSubmenu === "rutas" ? styles.open : ""
                  } ${pathname.startsWith("/rutas") ? styles.active : ""}`}
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
                className={`${styles.hasSubmenu} ${openSubmenu === "zonas" ? styles.open : ""
                  } ${pathname.startsWith("/zonas") ? styles.active : ""}`}
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
                  className={`${styles.hasSubmenu} ${openSubmenu === "ubicaciones" ? styles.open : ""
                    } ${pathname.startsWith("/ubicaciones") ? styles.active : ""}`}
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
                  className={`${styles.hasSubmenu} ${openSubmenu === "calificaciones" ? styles.open : ""
                    } ${pathname.startsWith("/calificaciones") ? styles.active : ""}`}
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
                    <Link
                      href="/eventos"
                      className={`${styles.navLink} ${pathname === "/eventos" ? styles.active : ""}`}
                    >
                      <FaCalendarAlt className={styles.navIcon} />
                      Eventos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/configuracion"
                      className={`${styles.navLink} ${pathname === "/configuracion" ? styles.active : ""}`}
                    >
                      <FaCogs className={styles.navIcon} />
                      Configuración
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <div className={styles.right}>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {/* <NotificationDropdown /> */}
              {user ? (
                <ProfileDropdown />
              ) : (
                <Link href="/auth/login" className={styles.loginButton}>
                  <FaRegUser className={styles.userIcon} />
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </header>
      </div>

      {menuOpen && (
        <div className={styles.bottomNav}>
          {[
            { href: "/mapa", icon: <FaMapMarkedAlt />, label: "Mapa" },
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
              className={`${styles.bottomNavItem} ${pathname === link.href ? styles.active : ""}`}
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
