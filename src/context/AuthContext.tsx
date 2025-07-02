"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Usuario } from "@/types/entities/Usuario";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;

type AuthContextProps = {
  user: Usuario | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/auth/me`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("No autorizado");

      const data = await res.json();

      // Validación de datos mínimos esperados
      if (!data.id || !data.user || !data.email) {
        throw new Error("Datos incompletos del usuario");
      }

      setUser({
        id_usuario: data.id,
        nombre_usuario: data.user,
        correo: data.email,
        rol: data.rol ?? "usuario",
        clave: "", // nunca se expone
        fecha_registro: data.fecha_registro ?? "",
        activo: data.activo ?? true,
        avatar_url: data.avatar_url ?? undefined,
      });
    } catch (error) {
      setUser(null);
      const msg = error instanceof Error ? error.message : "Error desconocido";
      if (msg !== "No autorizado") {
        console.error("Error al obtener usuario:", msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.warn("Error al cerrar sesión:", error);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
