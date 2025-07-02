import { useState } from "react";
import api from "@/services/axios";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export function useRegister() {
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (
    nombre: string,
    correo: string,
    clave: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        nombre_usuario: nombre,
        correo,
        clave,
        rol: "usuario",
      });

      const result = await login({ correo, clave });

      if (result?.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Error al registrar.";
        setError(msg);
        return { success: false, error: msg };
      } else {
        const msg = "Error inesperado.";
        setError(msg);
        return { success: false, error: msg };
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error };
}
