"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./LoginForm.module.css";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

type LoginForm = {
  correo: string;
  clave: string;
};

export default function LoginForm() {
  const router = useRouter();
  const { fetchUser, errors, isLoading, user } = useAuth();
  const [form, setForm] = useState<LoginForm>({ correo: "", clave: "" });
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUser({
      correo: form.correo,
      clave: form.clave
    });
  };

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user]);

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1 className={styles.title}>
            Bienvenido a <span>TranquiRutas</span>
          </h1>
          <p className={styles.subtitle}>
            Explora rutas seguras con ayuda de toda la comunidad.
          </p>

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
            disabled={isLoading}
            className={styles.primaryButton}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>

          <div className={styles.orSeparator}>o</div>

            <button
            type="button"
            className={styles.googleButton}
            disabled={isLoading}
            >
            <FaGoogle />
            Iniciar sesión con Google
            </button>

          <p className={styles.loginPrompt}>
            ¿No tienes cuenta?{" "}
            <Link href="/auth/registro" className={styles.link}>
              Regístrate
            </Link>
          </p>

          {error && <p className={styles.error}>{error}</p>}
        </form>

        <div className={styles.rightPanel}>
          <h2>Impulsado por la comunidad</h2>
          <p>
            Únete a miles de usuarios que contribuyen a crear rutas más seguras
            compartiendo eventos y zonas en tiempo real.
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
