"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import InputField from "@/components/UI/InputField";
import ToastNotification from "@/components/UI/ToastNotification";
import styles from "./page.module.css";
import { useUpdateUser } from "@/services/querys/user.query";
import { Usuario } from "@/types/entities/Usuario";

export default function EditarPerfilPage() {
  const { user, fetchUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<Partial<Usuario>>({
    nombre_usuario: "",
    correo: "",
    clave: "",
    rol: "usuario",
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const { mutate: actualizarUsuario, isPending } = useUpdateUser();

  useEffect(() => {
    if (user) {
      setForm({
        nombre_usuario: user.nombre_usuario,
        correo: user.correo,
        clave: "",
        rol: user.rol ?? "usuario",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload: Partial<Usuario> = {
      nombre_usuario: form.nombre_usuario,
      correo: form.correo,
      ...(form.clave ? { clave: form.clave } : {}),
      ...(user.rol === "admin" ? { rol: form.rol } : {}),
    };

    actualizarUsuario(
      { id: String(user.id_usuario), form: payload },
      {
        onSuccess: async () => {
          setToast({ message: "✅ Perfil actualizado correctamente", type: "success" });
          await fetchUser();
          setTimeout(() => router.push("/perfil"), 1500);
        },
        onError: (error: unknown) => {
          const msg = error instanceof Error ? error.message : "Error inesperado";
          setToast({ message: `❌ ${msg}`, type: "error" });
        },
      }
    );
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario", "moderador"]}>
      <div className={styles.container}>
        <h1 className={styles.title}>Editar Perfil</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <InputField
            label="Nombre"
            name="nombre_usuario"
            value={form.nombre_usuario || ""}
            onChange={handleChange}
          />
          <InputField
            label="Correo"
            name="correo"
            type="email"
            value={form.correo || ""}
            onChange={handleChange}
          />
          <InputField
            label="Nueva Clave"
            name="clave"
            type="password"
            value={form.clave || ""}
            onChange={handleChange}
          />

          {user?.rol === "admin" && (
            <>
              <label>Rol</label>
              <select name="rol" value={form.rol || "usuario"} onChange={handleChange}>
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
                <option value="moderador">Moderador</option>
              </select>
            </>
          )}

          <button type="submit" className={styles.submitButton} disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>

        {toast && <ToastNotification message={toast.message} type={toast.type} />}
      </div>
    </ProtectedRoute>
  );
}
