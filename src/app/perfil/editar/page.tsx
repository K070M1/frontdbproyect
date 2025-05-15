"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LayoutShell from "@/components/Layout/LayoutShell";
import InputField from "@/components/UI/InputField";
import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import styles from "./page.module.css";

export default function EditarPerfilPage() {
  const { user, fetchUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: user?.username || "",
    correo: user?.correo || "",
    clave: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api"}/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nombre_usuario: form.nombre,
          correo: form.correo,
          ...(form.clave && { clave: form.clave }),
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar perfil");

      await fetchUser(); // actualizar datos en contexto
      router.push("/perfil");

    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <LayoutShell>
        <h1 className={styles.title}>Editar Perfil</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <InputField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} />
          <InputField label="Correo" name="correo" type="email" value={form.correo} onChange={handleChange} />
          <InputField label="Nueva Clave" name="clave" type="password" value={form.clave} onChange={handleChange} />
          <button type="submit" className={styles.submitButton}>Guardar Cambios</button>
        </form>
      </LayoutShell>
    </ProtectedRoute>
  );
}
