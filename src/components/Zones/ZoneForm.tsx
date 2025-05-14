"use client";

import { useState } from 'react';
import styles from './ZoneForm.module.css';

export default function ZoneForm() {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registrando zona segura:', form);
    // PENDIENT: enviar data al backend
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Registrar Zona Segura</h2>

      <label htmlFor="nombre">Nombre de la Zona</label>
      <input
        id="nombre"
        type="text"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />

      <label htmlFor="descripcion">Descripción</label>
      <textarea
        id="descripcion"
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        required
      ></textarea>

      <button type="submit">Guardar Zona</button>
    </form>
  );
}
