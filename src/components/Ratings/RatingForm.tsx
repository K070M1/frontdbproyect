"use client";

import { useState, useMemo } from 'react';
import BaseMap from "@/components/Map/BaseMap";
import { Button } from '@heroui/button'
import { FaStar, FaComment, FaS } from 'react-icons/fa6'
import { MapMarker, Marker, InfoWindow, Polyline, Polygon } from '@/components/Map/MapShell'

type RatingFormProps = {
  id_usuario: number;
};

export default function RatingForm({ id_usuario }: RatingFormProps) {
  const defaultCenter = useMemo(() => ({ lat: -12.127, lng: -76.973 }), []);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [hoveredStar, setHoveredStar] = useState(0);

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

  const handleStarClick = (rating: number) => {
    setForm((prev) => ({ ...prev, calificacion: rating }))
  }

  const getRatingText = (rating: number) => {
    const ratings = {
      1: "Muy malo",
      2: "Malo",
      3: "Regular",
      4: "Bueno",
      5: "Excelente",
    }
    return ratings[rating as keyof typeof ratings] || "Sin calificar"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       <div className="col-span-1 shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 p-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaStar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Calificar Punto de Interés</span>
              <p className="text-gray-600">Comparte tu experiencia en este lugar</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaStar className="w-4 h-4" />
                Puntuación
              </span>
              <div className="flex items-center gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FaStar
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredStar || form.calificacion) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className='flex justify-center'>
                {form.calificacion > 0 && (
                    <div className="text-xs p-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 w-20 text-center">
                      {getRatingText(form.calificacion)}
                    </div>
                  )}
              </div>
            </div>

            {/* Campo de comentario */}
            <div className="space-y-3">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaComment className="w-4 h-4" />
                Comentario
              </span>
              <textarea
                id="comentario"
                name="comentario"
                placeholder="Cuéntanos sobre tu experiencia en este lugar..."
                value={form.comentario}
                onChange={handleChange}
                required
                className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 w-full border rounded-lg p-3 shadow-sm transition-colors focus:outline-none"
              ></textarea>
              <div className="text-xs text-gray-500">{form.comentario.length}/500 caracteres</div>
            </div>

            {/* Botón de envío */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={form.calificacion === 0 || !form.comentario.trim()}
            >
              Enviar Calificación
            </Button>
          </form>
        </div>
      </div>
      <div className="col-span-2 h-[calc(100vh-300px)] rounded-2xl overflow-hidden border border-gray-300 shadow-lg">
        <BaseMap key={`${userPosition ? userPosition.toString() : defaultCenter.toString()}`} center={userPosition || defaultCenter} >
          {(userPosition) && <MapMarker position={userPosition} iconSize={{ height: 50, width: 50 }} />}
        </BaseMap>
      </div>
    </div>
  );
}
