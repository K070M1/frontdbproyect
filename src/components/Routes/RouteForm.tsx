"use client";

import { useState } from "react";
import InputField from "@/components/UI/InputField";
import CheckboxField from "@/components/UI/CheckboxField";
import SelectField from "@/components/UI/SelectField";
import styles from "./RouteForm.module.css";

const mockUbicaciones = [
  { id: 1, nombre: "Plaza de Armas" },
  { id: 2, nombre: "Parque Ecológico" },
  { id: 3, nombre: "Av. Javier Prado" },
  { id: 4, nombre: "Av. Arequipa" },
];

export default function RouteForm() {
  const [form, setForm] = useState({
    id_origen: 1,
    id_destino: 2,
    riesgo: 1,
    tiempo_estimado: "00:30:00",
    favorito: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : name === "riesgo" || name.startsWith("id_")
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registrando ruta:", form);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Registrar Ruta</h2>

      <SelectField
        label="Origen"
        name="id_origen"
        value={form.id_origen}
        options={mockUbicaciones.map((u) => ({ value: u.id, label: u.nombre }))}
        onChange={handleChange}
      />

      <SelectField
        label="Destino"
        name="id_destino"
        value={form.id_destino}
        options={mockUbicaciones.map((u) => ({ value: u.id, label: u.nombre }))}
        onChange={handleChange}
      />

      <InputField
        label="Riesgo (1-10)"
        name="riesgo"
        type="number"
        value={form.riesgo.toString()}
        onChange={handleChange}
        min={1}
        max={10}
      />

      <InputField
        label="Tiempo Estimado (HH:MM:SS)"
        name="tiempo_estimado"
        value={form.tiempo_estimado}
        onChange={handleChange}
      />

      <CheckboxField
        label="Marcar como favorito"
        name="favorito"
        checked={form.favorito}
        onChange={handleChange}
      />

      <button type="submit" className={styles.submitButton}>
        Guardar Ruta
      </button>
    </form>
  );
}
