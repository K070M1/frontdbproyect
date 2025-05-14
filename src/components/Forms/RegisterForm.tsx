"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { mockUsers } from "@/data/mockUsers";
import { setUserCookie } from "@/utils/setUserCookie";
import styles from "./RegisterForm.module.css";

export default function RegisterForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    clave: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const exists = mockUsers.some((u) => u.correo === form.correo);
    if (exists) {
      setError("Este correo ya está registrado.");
      return;
    }

    const newUser = {
      id: mockUsers.length + 1,
      username: form.correo.split("@")[0],
      password: form.clave,
      role: "usuario",
      nombre: form.nombre,
      correo: form.correo,
      fechaRegistro: new Date().toISOString().split("T")[0],
    };

    mockUsers.push(newUser);

    login(newUser);
    setUserCookie(newUser);

    router.push("/perfil");
  };

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

      <button type="submit">Registrar</button>

      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
