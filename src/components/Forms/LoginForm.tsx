"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLogin } from "@/hooks/useLogin";
import styles from "./LoginForm.module.css";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

// Definición del tipo para el formulario de login
type LoginForm = {
  correo: string;
  clave: string;
};

export default function LoginForm() {
  const router = useRouter();
  const { handleLogin, error, loading } = useLogin();

  const [form, setForm] = useState<LoginForm>({ correo: "", clave: "" });
  const [mounted, setMounted] = useState(false);
  const [localError, setLocalError] = useState("");

  // Marca el componente como montado para evitar errores en SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // Maneja el cambio en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setLocalError(""); // Limpia error local al escribir
  };

  // Envía el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.correo || !form.clave) {
      setLocalError("Todos los campos son obligatorios");
      return;
    }

    const result = await handleLogin(form.correo, form.clave);

    if (result.success) {
      router.push("/dashboard");
    }
  };

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

          {(localError || error) && (
            <p className={styles.error}>{localError || error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={styles.primaryButton}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className={styles.orSeparator}>o</div>

          <button
            type="button"
            className={styles.googleButton}
            disabled={loading}
          >
            <FaGoogle />
            Iniciar sesión con Google
          </button>

          <p className={styles.loginPrompt}>
            ¿No tienes cuenta?{" "}
            <Link href="/auth/register" className={styles.link}>
              Regístrate
            </Link>
          </p>
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
