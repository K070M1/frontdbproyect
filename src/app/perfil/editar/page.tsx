"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LayoutShell from "@/components/Layout/LayoutShell";
import InputField from "@/components/UI/InputField";
import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import styles from "./page.module.css";

export default function EditarPerfilPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: user?.nombre || "",
    correo: user?.correo || "",
    clave: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const updatedUser = {
      ...user,
      nombre: form.nombre,
      correo: form.correo,
    };

    login({ username: updatedUser.username, password: user.password }); // solo refresca context/cookie
    router.push("/perfil");
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <LayoutShell>
        <h1>Editar Perfil</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <InputField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
          <InputField
            label="Correo"
            name="correo"
            type="email"
            value={form.correo}
            onChange={handleChange}
          />
          <InputField
            label="Nueva Clave"
            name="clave"
            type="password"
            value={form.clave}
            onChange={handleChange}
          />
          <button type="submit" className={styles.submitButton}>
            Guardar Cambios
          </button>
        </form>
      </LayoutShell>
    </ProtectedRoute>
  );
}
