import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function useLogin() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    correo: string,
    clave: string
  ): Promise<{ success: boolean; error?: string }> => {
    setError("");
    setLoading(true);

    try {
      const result = await login({ correo: correo.trim(), clave });

      if (result?.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch {
      const msg = "Error inesperado al iniciar sesión.";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    error,
    loading,
  };
}
