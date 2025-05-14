"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const success = login({ username: form.username, password: form.password });

    if (success) {
      setError("");
      router.push("/dashboard");
    } else {
      setError("Credenciales inválidas. Verifica tu usuario y contraseña.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Iniciar Sesión</h2>

      <label htmlFor="username">Usuario</label>
      <input
        type="text"
        id="username"
        name="username"
        value={form.username}
        onChange={handleChange}
        required
      />

      <label htmlFor="password">Contraseña</label>
      <input
        type="password"
        id="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <button type="submit">Entrar</button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
