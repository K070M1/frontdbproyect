"use client";

import { useState } from "react";
import InputField from "@/components/UI/InputField";
import SelectField from "@/components/UI/SelectField";
import Button from "@/components/UI/Button/Button";
import ToastNotification from "@/components/UI/ToastNotification";
import styles from "./UserCreateForm.module.css";
import { Rol } from "@/types/enums/Rol";
import Image from "next/image";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

export default function UserCreateForm() {
  const [form, setForm] = useState({
    nombre_usuario: "",
    correo: "",
    clave: "",
    rol: Rol.Usuario,
    activo: true,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
    const parsedValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setToast({ message: "❌ Solo se permiten imágenes JPG o PNG", type: "error" });
      setAvatarFile(null);
      setPreview(null);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setToast({ message: "❌ Tamaño máximo permitido: 2MB", type: "error" });
      setAvatarFile(null);
      setPreview(null);
      return;
    }

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);
    setLoading(true);

    if (!form.nombre_usuario || !form.correo || !form.clave) {
      setToast({ message: "Todos los campos son obligatorios.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await fetch(`${BACKEND_URL}/users`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Error al crear usuario");

      setToast({ message: "✅ Usuario creado correctamente.", type: "success" });
      setForm({ nombre_usuario: "", correo: "", clave: "", rol: Rol.Usuario, activo: true });
      setAvatarFile(null);
      setPreview(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setToast({ message: `❌ ${msg}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data">
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
        <SelectField
          label="Rol"
          name="rol"
          value={form.rol}
          onChange={handleChange}
          options={[
            { value: Rol.Usuario, label: "Usuario" },
            { value: Rol.Admin, label: "Admin" },
            { value: "moderador", label: "Moderador" },
          ]}
        />

        <label>Avatar (JPG o PNG)</label>
        <input type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />

        {preview && (
          <div className={styles.avatarPreview}>
            <label>Vista previa del avatar:</label>
            <Image
              src={preview}
              alt="Avatar preview"
              width={120}
              height={120}
              className={styles.avatarImage}
            />
          </div>
        )}

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            name="activo"
            checked={form.activo}
            onChange={handleChange}
          />
          Usuario activo
        </label>

        <Button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </Button>
      </form>

      {toast && <ToastNotification message={toast.message} type={toast.type} />}
    </>
  );
}
