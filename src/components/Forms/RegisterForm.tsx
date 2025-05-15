"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import api from "@/services/axios";
import { useAuth } from "@/context/AuthContext";
import styles from "./RegisterForm.module.css";

export default function RegisterForm() {
  const router = useRouter();
  const { fetchUser } = useAuth();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    clave: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", form);

      await api.post("/auth/login", {
        correo: form.correo,
        clave: form.clave,
      }, { withCredentials: true });

      await fetchUser();
      router.replace("/perfil");

    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Error en el registro.");
      } else {
        setError("Error inesperado al registrar.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Registro de Usuario</h2>

      <label>Nombre</label>
      <input
        type="text"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />

      <label>Correo</label>
      <input
        type="email"
        name="correo"
        value={form.correo}
        onChange={handleChange}
        required
      />

      <label>Clave</label>
      <input
        type="password"
        name="clave"
        value={form.clave}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Registrando..." : "Registrar"}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
