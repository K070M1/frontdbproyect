"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/services/axios";
import { useAuth } from "@/context/AuthContext";
import styles from "./LoginForm.module.css";

type LoginForm = {
  correo: string;
  clave: string;
};

export default function LoginForm() {
  const router = useRouter();
  const { fetchUser } = useAuth();

  const [form, setForm] = useState<LoginForm>({ correo: "", clave: "" });
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      await api.post("/auth/login", data, { withCredentials: true });
    },
    onSuccess: async () => {
      await fetchUser();
      router.replace("/dashboard");
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Credenciales inválidas.");
      } else {
        setError("Error inesperado al iniciar sesión.");
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(form);
  };

  if (!mounted) return null; // Previene hydration mismatch

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Iniciar Sesión</h2>

      <label>Correo</label>
      <input
        type="email"
        name="correo"
        value={form.correo}
        onChange={handleChange}
        required
      />

      <label>Contraseña</label>
      <input
        type="password"
        name="clave"
        value={form.clave}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Entrando..." : "Entrar"}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
