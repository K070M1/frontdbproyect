"use client";

import { useState } from 'react';
import styles from './RatingForm.module.css';

type RatingFormProps = {
  id_usuario: number;
};

export default function RatingForm({ id_usuario }: RatingFormProps) {
  const [form, setForm] = useState({
    calificacion: 1,
    comentario: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'calificacion' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando calificación:', {
      id_usuario,
      ...form,
    });
    // TODO: POST /calificaciones
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Calificar</h2>

      <label>Puntuación (1 a 5)</label>
      <input
        type="number"
        name="calificacion"
        min={1}
        max={5}
        value={form.calificacion}
        onChange={handleChange}
        required
      />

      <label>Comentario</label>
      <textarea
        name="comentario"
        value={form.comentario}
        onChange={handleChange}
        required
      ></textarea>

      <button type="submit">Enviar Calificación</button>
    </form>
  );
}
