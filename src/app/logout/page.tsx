"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/axios";
import { useAuth } from "@/context/AuthContext";

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const logoutFlow = async () => {
      try {
        await api.post("/auth/logout");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        // No bloqueamos la salida aunque falle el backend.
      } finally {
        logout(); // limpiar contexto
        router.replace("/login");
      }
    };

    logoutFlow();
  }, [logout, router]);

  return <p>Cerrando sesión...</p>;
}
