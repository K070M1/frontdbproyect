import LayoutShell from '@/components/Layout/LayoutShell';
import RatingStars from '@/components/Ratings/RatingStars';

const mockRatings = [
  { score: 5, comentario: 'Excelente servicio en la zona segura.' },
  { score: 3, comentario: 'La ruta estaba regular, algo de tráfico.' },
  { score: 4, comentario: 'Evento bien controlado, buen trabajo.' },
];

export default function CalificacionesPage() {
  return (
    <LayoutShell>
      <h1>Calificaciones</h1>
      {mockRatings.map((rating, index) => (
        <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem', background: 'white' }}>
          <RatingStars score={rating.score} />
          <p>{rating.comentario}</p>
        </div>
      ))}
    </LayoutShell>
  );
}
