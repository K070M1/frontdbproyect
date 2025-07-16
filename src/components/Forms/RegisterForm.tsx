"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/useRegister";
import styles from "./RegisterForm.module.css";
import { FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import Image from "next/image";
import urlImage from "@/assets/ec9fc9bc-040a-4f70-9eb5-f1e8e8978bab.png";
import { useModalStore } from "@/store/modalStore";

type RegisterForm = {
  nombre: string;
  correo: string;
  clave: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const { handleRegister, error, loading } = useRegister();
  const setModal = useModalStore((s) => s.setModal);

  const [form, setForm] = useState<RegisterForm>({
    nombre: "",
    correo: "",
    clave: "",
  });
  const [localError, setLocalError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, correo, clave } = form;
    if (!nombre || !correo || !clave) {
      setLocalError("Todos los campos son obligatorios");
      return;
    }
    const result = await handleRegister(nombre, correo, clave);
    if (result.success) {
      router.replace("/perfil");
    }
  };

  const openLogin = () => {
    setModal("login");
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

          {(localError || error) && (
            <p className={styles.error}>{localError || error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={styles.primaryButton}
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>

          <p className={styles.loginPrompt}>
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={openLogin}
              className={styles.link}
            >
              Inicia sesión
            </button>
          </p>
        </form>

        <div className={styles.rightPanel}>
          <h2>Impulsado por la comunidad</h2>
          <p>
            Regístrate y contribuye a mantener seguras nuestras rutas urbanas
            junto a miles de usuarios activos.
          </p>
          <div className={styles.imageWrapper}>
            <Image
              src={urlImage}
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
