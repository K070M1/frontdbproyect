"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LayoutShell from "@/components/Layout/LayoutShell";
import InputField from "@/components/UI/InputField";
import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import ToastNotification from "@/components/UI/ToastNotification";
import styles from "./page.module.css";
import { useUpdateUser } from "@/services/querys/user.query";

export default function EditarPerfilPage() {
  const { user, fetchUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    nombre_usuario: user?.nombre_usuario ?? "",
    correo: user?.correo ?? "",
    clave: "",
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const { mutate: actualizarUsuario, isPending } = useUpdateUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload = {
      nombre_usuario: form.nombre_usuario,
      correo: form.correo,
      ...(form.clave && { clave: form.clave }),
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
      <LayoutShell>
        <h1 className={styles.title}>Editar Perfil</h1>
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
            label="Nueva Clave"
            name="clave"
            type="password"
            value={form.clave}
            onChange={handleChange}
          />
          <button type="submit" className={styles.submitButton} disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>

        {toast && <ToastNotification message={toast.message} type={toast.type} />}
      </LayoutShell>
    </ProtectedRoute>
  );
}
