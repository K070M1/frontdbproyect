"use client";

import { useEffect, useState } from "react";
import { CrearUbicacionDTO } from "@/types/dto/CrearUbicacionDTO";
import { Riesgo } from "@/types/enums/Riesgo";
import styles from "./UbicacionForm.module.css";
import { useAuth } from "@/context/AuthContext";

type Props = {
  initialData?: CrearUbicacionDTO;
  onSubmit?: (data: CrearUbicacionDTO) => void;
};

export default function UbicacionForm({ initialData, onSubmit }: Props) {
  const { user } = useAuth();

  const [form, setForm] = useState<CrearUbicacionDTO>({
    nombre: "",
    descripcion: "",
    latitud: -12.0464,
    longitud: -77.0428,
    riesgo: Riesgo.Medio,
    id_usuario: user?.id_usuario ?? 0,
  });

  useEffect(() => {
    if (user?.id_usuario) {
      setForm((prev) => ({ ...prev, id_usuario: user.id_usuario }));
    }
  }, [user]);

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
        id_usuario: user?.id_usuario ?? prev.id_usuario,
      }));
    }
  }, [initialData, user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "latitud" || name === "longitud"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && user?.id_usuario) {
      const payload = { ...form, id_usuario: user.id_usuario };
      console.log("📤 Datos enviados al backend:", payload);
      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>Nombre</label>
      <input
        type="text"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />

      <label>Descripción</label>
      <textarea
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        required
      />

      <label>Latitud</label>
      <input
        type="number"
        name="latitud"
        step="0.000001"
        value={form.latitud}
        onChange={handleChange}
        required
      />

      <label>Longitud</label>
      <input
        type="number"
        name="longitud"
        step="0.000001"
        value={form.longitud}
        onChange={handleChange}
        required
      />

      <label>Riesgo</label>
      <select
        name="riesgo"
        value={form.riesgo}
        onChange={handleChange}
        required
      >
        <option value={Riesgo.Bajo}>Bajo</option>
        <option value={Riesgo.Medio}>Medio</option>
        <option value={Riesgo.Alto}>Alto</option>
      </select>

      <button type="submit" className={styles.submitButton}>
        Guardar Ubicación
      </button>
    </form>
  );
}
