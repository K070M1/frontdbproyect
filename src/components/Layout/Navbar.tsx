"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProfileDropdown from "@/components/UI/Profile/ProfileDropdown";

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
import LoginModal from "@/components/UI/Modal/LoginModal";
import LoginForm from "@/components/Forms/LoginForm";
import RegisterModal from "@/components/UI/Modal/RegisterModal";
import RegisterForm from "@/components/Forms/RegisterForm";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.rol === "admin";
  const isLogged = Boolean(user);

  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Spinner state for navigation
  const [isNavigating, setIsNavigating] = useState(false);

  // Turn off spinner when path changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleSubmenu = (key: string) =>
    setOpenSubmenu((prev) => (prev === key ? null : key));
  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);
  const openRegister = () => setShowRegister(true);
  const closeRegister = () => setShowRegister(false);

  // Helper to wrap links with spinner trigger
  const NavLink = ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <Link href={href} className={className} onClick={() => setIsNavigating(true)}>
      {children}
    </Link>
  );

  return (
    <>
      {/* Global spinner overlay */}
      {isNavigating && (
        <div className={styles.globalSpinner}>
          <div className={styles.spinner} />
        </div>
      )}

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
            <NavLink
              href={user ? "/dashboard" : "/"}
              className={styles.logo}
            >
              <FaRoute className={styles.logoIcon} />
              <span>TranquiRutas</span>
            </NavLink>
          </div>

          <nav className={`${styles.center} ${menuOpen ? styles.menuOpen : ""}`}>
            <ul className={styles.menu}>
              <li>
                <NavLink
                  href="/mapa"
                  className={`${styles.navLink} ${
                    pathname === "/mapa" ? styles.active : ""
                  }`}
                >
                  <FaMapMarkedAlt className={styles.navIcon} />
                  Mapa
                </NavLink>
              </li>

              <li
                className={`${styles.hasSubmenu} ${
                  openSubmenu === "rutas" ? styles.open : ""
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
                    <NavLink href="/rutas">Ver Todas</NavLink>
                  </li>
                  {isLogged && (
                    <li>
                      <NavLink href="/rutas/nueva">Nueva Ruta</NavLink>
                    </li>
                  )}
                </ul>
              </li>

              <li
                className={`${styles.hasSubmenu} ${
                  openSubmenu === "zonas" ? styles.open : ""
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
                    <NavLink href="/zonas">Zonas Seguras</NavLink>
                  </li>
                </ul>
              </li>

              {isLogged && (
                <li
                  className={`${styles.hasSubmenu} ${
                    openSubmenu === "ubicaciones" ? styles.open : ""
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
                      <NavLink href="/ubicaciones">Ver Todas</NavLink>
                    </li>
                  </ul>
                </li>
              )}

              {isLogged && (
                <li
                  className={`${styles.hasSubmenu} ${
                    openSubmenu === "calificaciones" ? styles.open : ""
                  } ${
                    pathname.startsWith("/calificaciones")
                      ? styles.active
                      : ""
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
                      <NavLink href="/calificaciones">
                        Mis Calificaciones
                      </NavLink>
                    </li>
                    <li>
                      <NavLink href="/calificaciones/nueva">
                        Nueva Calificación
                      </NavLink>
                    </li>
                  </ul>
                </li>
              )}

              {isAdmin && (
                <>
                  <li>
                    <NavLink
                      href="/eventos"
                      className={`${styles.navLink} ${
                        pathname === "/eventos" ? styles.active : ""
                      }`}
                    >
                      <FaCalendarAlt className={styles.navIcon} />
                      Eventos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      href="/configuracion"
                      className={`${styles.navLink} ${
                        pathname === "/configuracion" ? styles.active : ""
                      }`}
                    >
                      <FaCogs className={styles.navIcon} />
                      Configuración
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <div className={styles.right}>
            <div className={styles.actions}>
              <ThemeToggle />
              {user ? (
                <ProfileDropdown />
              ) : (
                <>
                  <button className={styles.loginButton} onClick={openLogin}>
                    <FaRegUser className={styles.userIcon} /> Iniciar Sesión
                  </button>
                  <button
                    className={styles.registerButton}
                    onClick={openRegister}
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        </header>
      </div>

      {menuOpen && (
        <div className={styles.bottomNav}>
          {/* bottom nav items unchanged */}
        </div>
      )}

      <LoginModal isOpen={showLogin} onClose={closeLogin}>
        <LoginForm />
      </LoginModal>

      <RegisterModal isOpen={showRegister} onClose={closeRegister}>
        <RegisterForm />
      </RegisterModal>
    </>
  );
}
