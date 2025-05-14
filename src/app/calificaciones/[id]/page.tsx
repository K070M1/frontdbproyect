"use client";

import LayoutShell from '@/components/Layout/LayoutShell';
import DetailView from '@/components/Forms/DetailView';
import RatingStars from '@/components/Ratings/RatingStars';
import { useParams } from 'next/navigation';

const mockRatings = [
  {
    id: '1',
    score: 5,
    comentario: 'Excelente servicio en la zona segura.',
    tipo_calificacion: 'Zona Segura',
  },
  {
    id: '2',
    score: 3,
    comentario: 'La ruta estaba regular, algo de tráfico.',
    tipo_calificacion: 'Ruta',
  },
  {
    id: '3',
    score: 4,
    comentario: 'Evento bien controlado, buen trabajo.',
    tipo_calificacion: 'Evento',
  },
];

export default function CalificacionDetallePage() {
  const { id } = useParams();

  const calificacion = mockRatings.find((r) => r.id === id);

  if (!calificacion) {
    return (
      <LayoutShell>
        <h1>Calificación no encontrada</h1>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell>
      <h1>Detalle de Calificación ID: {id}</h1>

      <RatingStars score={calificacion.score} />

      <DetailView
        title="Detalle de la Calificación"
        fields={[
          { label: 'Comentario', value: calificacion.comentario },
          { label: 'Tipo', value: calificacion.tipo_calificacion },
          { label: 'Puntuación', value: calificacion.score },
        ]}
      />
    </LayoutShell>
  );
}
