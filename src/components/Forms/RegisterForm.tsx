"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import api from "@/services/axios";
import { useAuth } from "@/context/AuthContext";
import styles from "./RegisterForm.module.css";
import { FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

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

      await api.post(
        "/auth/login",
        {
          correo: form.correo,
          clave: form.clave,
        },
        { withCredentials: true }
      );

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
    <div className={styles.container}>
      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1 className={styles.title}>Crea tu cuenta</h1>
          <p className={styles.subtitle}>
            Accede a rutas seguras construidas por todos.
          </p>

          <div className={styles.inputGroup}>
            <FaUserPlus className={styles.icon} />
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.icon} />
            <input
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.icon} />
            <input
              type="password"
              name="clave"
              placeholder="Contraseña"
              value={form.clave}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.primaryButton}
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>

          <p className={styles.loginPrompt}>
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/login" className={styles.link}>
              Inicia sesión
            </Link>
          </p>

          {error && <p className={styles.error}>{error}</p>}
        </form>

        <div className={styles.rightPanel}>
          <h2>Impulsado por la comunidad</h2>
          <p>
            Regístrate y contribuye a mantener seguras nuestras rutas urbanas junto a miles de usuarios activos.
          </p>
          <div className={styles.imageWrapper}>
            <Image
              src="https://images.unsplash.com/photo-1581090700227-1e8a264f7b96"
              alt="Personas colaborando en comunidad"
              fill
              className={styles.image}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
