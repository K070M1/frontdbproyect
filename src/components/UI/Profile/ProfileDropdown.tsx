"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/axios";
import { Avatar } from "@heroui/react";
import styles from "./ProfileDropdown.module.css";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleLogout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      logout();
      router.replace("/auth/login");
    }
  }, [logout, router]);

  const navigateTo = useCallback(
    (path: string) => {
      router.push(path);
      setIsOpen(false);
    },
    [router]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={styles.container}>
      <button
        className={styles.avatarButton}
        onClick={handleToggle}
        aria-label="Perfil"
      >
        <Avatar
          name={user?.username || "Usuario"}
          size="sm"
          className={styles.avatarImage}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userInfoBox}>
            <div className={styles.avatarBorder}>
              <span className={styles.avatarInitials}>
                {user?.username
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <strong className={styles.userName}>
                {user?.username || "Usuario"}
              </strong>
              <div className={styles.userRole}>{user?.rol || "rol"}</div>
            </div>
          </div>

          <hr className={styles.divider} />

          <button
            onClick={() => navigateTo("/perfil")}
            className={styles.item}
          >
            Perfil
          </button>
          <button
            onClick={() => navigateTo("/perfil/editar")}
            className={styles.item}
          >
            Editar Perfil
          </button>
          <button onClick={handleLogout} className={styles.item}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
