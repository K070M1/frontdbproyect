"use client";

import { useState, useEffect, useRef, JSX } from "react";
import {
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaRoute,
} from "react-icons/fa";
import styles from "./NotificationDropdown.module.css";

type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  createdAt: string;
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: "success",
        message: "Nueva calificación registrada",
        createdAt: "2025-06-26T12:34:00Z",
      },
      {
        id: 2,
        type: "info",
        message: "Ruta aprobada por el admin",
        createdAt: "2025-06-25T15:20:00Z",
      },
      {
        id: 3,
        type: "warning",
        message: "Zona segura requiere revisión",
        createdAt: "2025-06-24T09:10:00Z",
      },
      {
        id: 4,
        type: "error",
        message: "Error al registrar evento",
        createdAt: "2025-06-23T18:45:00Z",
      },
    ]);
  }, []);

  const iconByType: Record<NotificationType, JSX.Element> = {
    info: <FaRoute />,
    success: <FaCheckCircle />,
    warning: <FaExclamationTriangle />,
    error: <FaTimesCircle />,
  };

  return (
    <div ref={dropdownRef} className={styles.dropdownWrapper}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={styles.iconButton}
        aria-label="Notificaciones"
      >
        <FaBell />
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.header}>Notificaciones</div>
          <ul className={styles.list}>
            {notifications.map((n) => (
              <li key={n.id} className={styles.item}>
                <span
                  className={`${styles.iconWrapper} ${styles[n.type]}`}
                  aria-hidden="true"
                >
                  {iconByType[n.type]}
                </span>
                <div>
                  <div>{n.message}</div>
                  <small className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
