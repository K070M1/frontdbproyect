"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./ProtectedRoute.module.css";

type ProtectedRouteProps = {
  allowedRoles?: string[]; // ← opcional por si alguna ruta requiere solo sesión
  children: React.ReactNode;
};

export default function ProtectedRoute({
  allowedRoles = [], // ← por defecto solo requiere sesión activa
  children,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;

    if (!user) {
      router.replace("/auth/login");
    } else if (
      allowedRoles.length > 0 &&
      (!user.rol || !allowedRoles.includes(user.rol))
    ) {
      router.replace("/unauthorized");
    }
  }, [user, isLoading, allowedRoles, router, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!user) return null;

  if (
    allowedRoles.length > 0 &&
    (!user.rol || !allowedRoles.includes(user.rol))
  ) {
    return (
      <div className={styles.unauthorizedContainer}>
        <h2>Acceso denegado</h2>
        <p>No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  return <>{children}</>;
}
