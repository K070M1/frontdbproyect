"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/entities/User";

type AuthContextProps = {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error("No autorizado");

      const data = await res.json();
      setUser({
        id: data.id,
        username: data.username,
        rol: data.rol,
        correo: data.email,
      });
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

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
