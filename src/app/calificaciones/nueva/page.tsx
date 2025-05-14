"use client";

import LayoutShell from '@/components/Layout/LayoutShell';
import RatingForm from '@/components/Ratings/RatingForm';

export default function NuevaCalificacionPage() {
  return (
    <LayoutShell>
      <h1>Registrar Nueva Calificación</h1>
      <RatingForm />
    </LayoutShell>
  );
}
