"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  FaTachometerAlt,
  FaRoute,
  FaShieldAlt,
  FaExclamationTriangle,
  FaStar,
  FaUser,
  FaTools,
} from "react-icons/fa";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin = user.rol === "admin";

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/rutas", label: "Rutas", icon: <FaRoute /> },
    { href: "/zonas", label: "Zonas Seguras", icon: <FaShieldAlt /> },
    { href: "/eventos", label: "Eventos", icon: <FaExclamationTriangle /> },
    { href: "/calificaciones", label: "Calificaciones", icon: <FaStar /> },
    { href: "/perfil", label: "Perfil", icon: <FaUser /> },
    ...(isAdmin
      ? [{ href: "/configuracion", label: "Panel de Administración", icon: <FaTools /> }]
      : []),
  ];

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul>
          {links.map(({ href, label, icon }) => (
            <li key={href}>
              <Link href={href} className={styles.link}>
                <span className={styles.icon}>{icon}</span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
