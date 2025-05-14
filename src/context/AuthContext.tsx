"use client";

import { createContext, useContext, useState } from "react";
import { setUserCookie } from "@/utils/setUserCookie";
import { clearUserCookie } from "@/utils/clearUserCookie";
import { mockUsers } from "@/data/mockUsers";

type User = {
  password: string;
  id: number;
  username: string;
  role: string;
  nombre: string;
  correo: string;
  fechaRegistro: string;
};

type AuthContextProps = {
  user: User | null;
  login: (credentials: { username: string; password: string }) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = ({ username, password }: { username: string; password: string }): boolean => {
    const foundUser = mockUsers.find((u) => u.username === username && u.password === password);

    if (foundUser) {
      const userWithDate: User = {
        ...foundUser,
        fechaRegistro: new Date().toISOString().split("T")[0],
      };

      setUser(userWithDate);
      setUserCookie(userWithDate);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    clearUserCookie();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
