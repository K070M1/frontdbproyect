"use client";

import { useRef, useState, useEffect } from "react";
import {
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaRoute,
} from "react-icons/fa";
import styles from "./NotificationDropdown.module.css";
import { useNotifications } from "@/context/NotificationContext";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications = [] } = useNotifications(); // default empty array

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

  const iconByType = {
    info: <FaRoute />,
    success: <FaCheckCircle />,
    warning: <FaExclamationTriangle />,
    error: <FaTimesCircle />,
  };

  return (
    <div ref={dropdownRef} className={styles.dropdownWrapper}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={styles.iconButton}
        aria-label="Notificaciones"
      >
        <FaBell />
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.header}>Notificaciones</div>
          <ul className={styles.list}>
            {(notifications?.length ?? 0) === 0 ? (
              <li className={styles.item}>Sin notificaciones recientes.</li>
            ) : (
              notifications.map((n) => (
                <li key={n.id} className={styles.item}>
                  <span
                    className={`${styles.iconWrapper} ${styles[n.type] || ""}`}
                    aria-hidden="true"
                  >
                    {iconByType[n.type] || <FaRoute />}
                  </span>
                  <div>
                    <div>{n.message}</div>
                    <small className="text-xs text-gray-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </small>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
