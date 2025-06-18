"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/axios";
import Image from "next/image";
import styles from "./ProfileDropdown.module.css";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      logout();
      router.replace("/auth/login");
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  // Generar URL del avatar usando ui-avatars.com
  // const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || "U")}&background=111827&color=fff&size=128`;
  const avatarUrl = user?.username
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.username
      )}&background=111827&color=fff&size=128`
    : "/images/avatar-default.png";

  return (
    <div className={styles.container}>
      <button
        className={styles.avatarButton}
        onClick={handleToggle}
        aria-label="Perfil"
      >
        <img
          src={avatarUrl}
          alt="Avatar"
          className={styles.avatarImage}
          width={36}
          height={36}
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

          <button onClick={() => navigateTo("/perfil")} className={styles.item}>
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
