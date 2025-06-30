"use client";
import { useLogin, useLogout } from '@/services/querys/auth.query'
import { createContext, use, useContext, useState } from "react";
import { useAuthStore } from '@/services/auth.store'
import { User } from "@/types/entities/User";

type AuthContextProps = {
  user: User | null;
  token?: string;
  setToken?: (token: string) => void;
  errors?: string[];
  setErrors?: (errors: string[]) => void;
  isLoading: boolean;
  fetchUser: (data: any) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, user, setToken, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { mutateAsync: loginUser } = useLogin();
  const { mutateAsync: logoutUser } = useLogout();

  const fetchUser = async ({ correo, clave }: { correo: string; clave: string }) => {
    try {
      setIsLoading(true);
      setErrors([]);
      const res = await loginUser({ correo, clave });
      if (!res) throw new Error("No autorizado");
      setToken(res?.token);
      setUser({ id: res?.id, username: res?.username, rol: res?.rol, correo: res?.email });
    } catch (e) {
      setUser(null);
      setToken("");
      if (e instanceof Error) {
        setErrors([e.message]);
      } else {
        setErrors(["Error inesperado al obtener el usuario"]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, fetchUser, logout, token, errors }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
