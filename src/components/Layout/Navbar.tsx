// frontend/src/components/Layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProfileDropdown from "@/components/UI/Profile/ProfileDropdown";
import { useModalStore } from "@/store/modalStore";

import {
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaStar,
  FaPlus,
  FaRegUser,
  // FaUsers,
  // FaUserPlus,
  FaCalendarAlt,
  FaCogs,
  FaShieldAlt,
  FaEllipsisH,
  FaBars,
  FaTimes,
  FaRoute
} from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";

import styles from "./Navbar.module.css";
import ThemeToggle from "../Utils/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.rol === "admin";
  const isLogged = Boolean(user);
  const { openModal, setModal } = useModalStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  // Desktop nav link
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

  // Mobile icon button
  const NavIconButton = ({
    href,
    Icon,
    label,
  }: {
    href: string;
    Icon: React.ComponentType;
    label: string;
  }) => (
    <Link
      href={href}
      className={`${styles.navIconButton}${pathname === href ? ` ${styles.active}` : ""}`}
      onClick={() => setIsNavigating(true)}
    >
      <Icon />
      <span className={styles.tooltip}>{label}</span>
    </Link>
  );

  // configure items
  const items = [
    { href: "/mapa", Icon: FaMapMarkedAlt, label: "Mapa", show: true },
    { href: "/rutas", Icon: FiMapPin, label: "Rutas", show: isLogged },
    { href: "/zonas", Icon: FaShieldAlt, label: "Zonas", show: isLogged },
    { href: "/ubicaciones", Icon: FaMapMarkerAlt, label: "Ubicaciones", show: isLogged },
    { href: "/calificaciones", Icon: FaStar, label: "Calificaciones", show: isLogged },
    { href: "/eventos", Icon: FaCalendarAlt, label: "Eventos", show: isAdmin },
    { href: "/configuracion", Icon: FaCogs, label: "Configuración", show: isAdmin },
  ];
  const visible = items.filter(i => i.show);
  const maxIcons = 4;
  const mainIcons = visible.slice(0, maxIcons);
  const overflow = visible.slice(maxIcons);

  return (
    <>
      {isNavigating && (
        <div className={styles.globalSpinner}>
          <div className={styles.spinner} />
        </div>
      )}

      {/* Desktop Header */}
      <div className={styles.navWrapper}>
        <header className={styles.navbar}>
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menú"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div className={styles.left}>
            <NavLink href={user ? "/dashboard" : "/"} className={styles.logo}>
              <FaRoute className={styles.logoIcon} />
              <span>TranquiRutas</span>
            </NavLink>
          </div>

          <nav className={`${styles.center} ${menuOpen ? styles.menuOpen : ""}`}>
            <ul className={styles.menu}>
              <li>
                <NavLink
                  href="/mapa"
                  className={`${styles.navLink} ${pathname === "/mapa" ? styles.active : ""}`}
                >
                  <FaMapMarkedAlt className={styles.navIcon} />
                  Mapa
                </NavLink>
              </li>

              <li
                className={`${styles.hasSubmenu} ${openSubmenu === "rutas" ? styles.open : ""} ${
                  pathname.startsWith("/rutas") ? styles.active : ""
                }`}
              >
                <span
                  className={styles.navLink}
                  onClick={() =>
                    setOpenSubmenu(v => (v === "rutas" ? null : "rutas"))
                  }
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
                  <li><NavLink href="/rutas">Ver Todas</NavLink></li>
                  {isLogged && <li><NavLink href="/rutas/nueva">Nueva Ruta</NavLink></li>}
                </ul>
              </li>

              <li
                className={`${styles.hasSubmenu} ${openSubmenu === "zonas" ? styles.open : ""} ${
                  pathname.startsWith("/zonas") ? styles.active : ""
                }`}
              >
                <span
                  className={styles.navLink}
                  onClick={() =>
                    setOpenSubmenu(v => (v === "zonas" ? null : "zonas"))
                  }
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
                  <li><NavLink href="/zonas">Zonas Seguras</NavLink></li>
                </ul>
              </li>

              {isLogged && (
                <li
                  className={`${styles.hasSubmenu} ${openSubmenu === "ubicaciones" ? styles.open : ""} ${
                    pathname.startsWith("/ubicaciones") ? styles.active : ""
                  }`}
                >
                  <span
                    className={styles.navLink}
                    onClick={() =>
                      setOpenSubmenu(v => (v === "ubicaciones" ? null : "ubicaciones"))
                    }
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
                    <li><NavLink href="/ubicaciones">Ver Todas</NavLink></li>
                  </ul>
                </li>
              )}

              {isLogged && (
                <li
                  className={`${styles.hasSubmenu} ${openSubmenu === "calificaciones" ? styles.open : ""} ${
                    pathname.startsWith("/calificaciones") ? styles.active : ""
                  }`}
                >
                  <span
                    className={styles.navLink}
                    onClick={() =>
                      setOpenSubmenu(v => (v === "calificaciones" ? null : "calificaciones"))
                    }
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
                    <li><NavLink href="/calificaciones">Mis Calificaciones</NavLink></li>
                    <li><NavLink href="/calificaciones/nueva">Nueva Calificación</NavLink></li>
                  </ul>
                </li>
              )}

              {isAdmin && (
                <>
                  <li>
                    <NavLink
                      href="/eventos"
                      className={`${styles.navLink} ${pathname === "/eventos" ? styles.active : ""}`}
                    >
                      <FaCalendarAlt className={styles.navIcon} />
                      Eventos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      href="/configuracion"
                      className={`${styles.navLink} ${pathname === "/configuracion" ? styles.active : ""}`}
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
            <ThemeToggle />
            {user ? (
              <ProfileDropdown />
            ) : (
              <>
                <button className={styles.loginButton} onClick={() => setModal("login")}>
                  <FaRegUser className={styles.userIcon} /> Iniciar
                </button>
                <button className={styles.registerButton} onClick={() => setModal("register")}>
                  <FaPlus className={styles.registerIcon} /> Registrarse
                </button>
              </>
            )}
          </div>
        </header>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className={styles.bottomNav}>
        <NavIconButton href={user ? "/dashboard" : "/"} Icon={FaRoute} label="Inicio" />
        {mainIcons.map(item => (
          <NavIconButton
            key={item.href}
            href={item.href}
            Icon={item.Icon}
            label={item.label}
          />
        ))}
        {overflow.length > 0 && (
          <button
            className={styles.navIconButton}
            onClick={() => setOverflowOpen(v => !v)}
          >
            <FaEllipsisH />
            <span className={styles.tooltip}>Más</span>
          </button>
        )}
        <ThemeToggle />
        {user ? (
          <ProfileDropdown />
        ) : (
          <>
            <button className={styles.navIconButton} onClick={() => setModal("login")}>
              <FaRegUser />
              <span className={styles.tooltip}>Iniciar</span>
            </button>
            <button className={styles.navIconButton} onClick={() => setModal("register")}>
              <FaPlus />
              <span className={styles.tooltip}>Registrarse</span>
            </button>
          </>
        )}
      </nav>

      {overflowOpen && (
        <div className={styles.overflowMenu}>
          <ul>
            {overflow.map(item => (
              <li key={item.href}>
                <Link href={item.href} className={styles.overflowLink}>
                  <item.Icon /> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
