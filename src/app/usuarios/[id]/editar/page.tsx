"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LayoutShell from "@/components/Layout/LayoutShell";
import InputField from "@/components/UI/InputField";
import ToastNotification from "@/components/UI/ToastNotification";
import { useGetUserById, useUpdateUser } from "@/services/querys/user.query";
import styles from "./page.module.css";

export default function EditarUsuarioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: user, isLoading, error } = useGetUserById(id);
  const updateUser = useUpdateUser();

  const [form, setForm] = useState({
    nombre_usuario: "",
    correo: "",
    clave: "",
    rol: "usuario",
    activo: true,
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        nombre_usuario: user.nombre_usuario,
        correo: user.correo,
        clave: "",
        rol: user.rol ?? "usuario",
        activo: user.activo,
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target;
    const value =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateUser.mutateAsync({ id, form });

      setToast({
        message: "Usuario actualizado correctamente",
        type: "success",
      });

      setTimeout(() => router.push(`/usuarios/${id}`), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      setToast({ message: msg, type: "error" });
    }
  };

  return (
    <LayoutShell>
      <h1 className={styles.title}>Editar Usuario #{id}</h1>

      {toast && <ToastNotification message={toast.message} type={toast.type} />}

      {isLoading && <p className={styles.info}>Cargando datos...</p>}

      {error && (
        <ToastNotification
          message={
            error instanceof Error ? error.message : "Error al cargar usuario"
          }
          type="error"
        />
      )}

      {user && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <InputField
            label="Nombre"
            name="nombre_usuario"
            value={form.nombre_usuario}
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
            label="Clave"
            name="clave"
            type="password"
            value={form.clave}
            onChange={handleChange}
          />

          <label>Rol</label>
          <select name="rol" value={form.rol} onChange={handleChange}>
            <option value="usuario">Usuario</option>
            <option value="admin">Admin</option>
            <option value="moderador">Moderador</option>
          </select>

          <label>
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
            />
            Usuario Activo
          </label>

          <button type="submit" className={styles.submitButton}>
            Guardar Cambios
          </button>
        </form>
      )}
    </LayoutShell>
  );
}
