"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/axios";
import styles from "./ProfileDropdown.module.css";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      logout();
      router.replace("/login");
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <button className={styles.avatarButton} onClick={handleToggle}>
        <span className={styles.avatar}>👤</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button onClick={() => navigateTo("/perfil")} className={styles.item}>
            Perfil
          </button>
          <button onClick={() => navigateTo("/perfil/editar")} className={styles.item}>
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
