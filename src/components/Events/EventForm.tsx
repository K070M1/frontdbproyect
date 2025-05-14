"use client";

import { useState } from 'react';
import styles from './EventForm.module.css';

export default function EventForm() {
  const [form, setForm] = useState({
    tipo: '',
    descripcion: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registrando evento:', form);
    // data para el backend - pendiente
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Registrar Evento</h2>

      <label className={styles.label}>Tipo de Evento</label>
      <input
        type="text"
        name="tipo"
        value={form.tipo}
        onChange={handleChange}
        required
        className={styles.input}
      />

      <label className={styles.label}>Descripción</label>
      <textarea
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        required
        className={styles.textarea}
      ></textarea>

      <button type="submit" className={styles.button}>Guardar Evento</button>
    </form>
  );
}
