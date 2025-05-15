"use client";

import { useState } from "react";
import styles from "./UserForm.module.css";

type UserData = {
  id: number;
  nombre: string;
  rol: string;
  correo: string;
};

type UserFormProps = {
  initialData: UserData;
  onSubmit: (data: Omit<UserData, "id">) => void;
};

export default function UserForm({ initialData, onSubmit }: UserFormProps) {
  const [form, setForm] = useState<Omit<UserData, "id">>({
    nombre: initialData.nombre,
    rol: initialData.rol,
    correo: initialData.correo,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="nombre">Nombre</label>
      <input
        type="text"
        id="nombre"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />

      <label htmlFor="correo">Correo</label>
      <input
        type="email"
        id="correo"
        name="correo"
        value={form.correo}
        onChange={handleChange}
        required
      />

      <label htmlFor="rol">Rol</label>
      <select
        id="rol"
        name="rol"
        value={form.rol}
        onChange={handleChange}
        required
      >
        <option value="admin">Administrador</option>
        <option value="usuario">Usuario</option>
        <option value="moderador">Moderador</option>
      </select>

      <button type="submit">Actualizar</button>
    </form>
  );
}
