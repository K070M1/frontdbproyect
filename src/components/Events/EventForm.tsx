"use client";

import { useState } from "react";
import styles from "./EventForm.module.css";
import { TipoEventoEnum } from "@/types/enums/TipoEvento";

export default function EventForm() {
  const [form, setForm] = useState({
    tipo: TipoEventoEnum.Robo,
    descripcion: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registrando evento:", form);
    // TODO: POST al backend
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Registrar Evento</h2>

      <label className={styles.label}>Tipo de Evento</label>
      <select
        name="tipo"
        value={form.tipo}
        onChange={handleChange}
        required
        className={styles.input}
      >
        {Object.values(TipoEventoEnum).map((tipo) => (
          <option key={tipo} value={tipo}>
            {tipo}
          </option>
        ))}
      </select>

      <label className={styles.label}>Descripción</label>
      <textarea
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        required
        className={styles.textarea}
      ></textarea>

      <button type="submit" className={styles.button}>
        Guardar Evento
      </button>
    </form>
  );
}
