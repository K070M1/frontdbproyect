"use client";

import { useState, useMemo } from 'react';
import { useRouter } from "next/navigation";
import BaseMap from "@/components/Map/BaseMap";
import { Button } from '@heroui/button'
import { FaStar, FaComment, FaS } from 'react-icons/fa6'
import { useGetZones } from '@/services/querys/zone.query';
import { useGetEvents } from '@/services/querys/event.query';
import { useGetCalifications, useAddCalification, useUpdateCalification } from '@/services/querys/calification.query';
import { MapMarker, Marker, InfoWindow, Polyline, Polygon } from '@/components/Map/MapShell'
import Swal from 'sweetalert2'

type RatingFormProps = {
  id_usuario?: number;
  initialData?: any; // Para el modo de edición
};

export default function RatingForm({ id_usuario, initialData }: RatingFormProps) {
  const router = useRouter();
  const defaultCenter = useMemo(() => ({ lat: -12.127, lng: -76.973 }), []);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [ratingTarget, setRatingTarget] = useState<any>(null); // Para saber qué estamos calificando
  const [ratingPosition, setRatingPosition] = useState<{ lat: number; lng: number } | null>(null);

  // Modo edición
  const isEditMode = !!initialData;

  const { data: zones } = useGetZones();
  const { data: events } = useGetEvents();
  const { data: califications } = useGetCalifications();
  const { mutateAsync: addCalification } = useAddCalification();
  const { mutateAsync: updateCalification } = useUpdateCalification();

  // Función para obtener la URL del icono según el tipo de evento
  const getIconUrl = (tipo: string) => {
    switch (tipo) {
      case "Robo":
        return "/map-icons/iThiefMap.png";
      case "Choque":
        return "/map-icons/iCarMap.png";
      case "Policia":
        return "/map-icons/iPoliceMap.png";
      case "Accidente":
        return "/map-icons/iCarMap.png";
      default:
        return "/map-icons/iWarningMap.png";
    }
  };

  const [form, setForm] = useState({
    calificacion: initialData?.calificacion || 1,
    comentario: initialData?.comentario || '',
    referencia: initialData ? (
      initialData.id_zona ? `Zona #${initialData.id_zona}` :
        initialData.id_evento ? `Evento #${initialData.id_evento}` :
          'Sin referencia'
    ) : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'calificacion' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // En modo edición, no necesitamos validar la selección del mapa
    if (!isEditMode && (!ratingTarget || !ratingPosition)) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor selecciona un punto en el mapa para calificar',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    try {
      const actionText = isEditMode ? 'actualizar' : 'enviar';
      const result = await Swal.fire({
        title: `¿${isEditMode ? 'Actualizar' : 'Enviar'} calificación?`,
        text: `¿Estás seguro de ${actionText} esta calificación?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Sí, ${actionText}`,
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        let response;

        if (isEditMode) {
          // Modo edición: solo actualizar calificación y comentario
          const updateData = {
            calificacion: form.calificacion,
            comentario: form.comentario,
          };

          response = await updateCalification({
            id: initialData.id_calificacion,
            form: updateData
          });
        } else {
          // Modo creación: lógica original
          const calificationData: any = {
            calificacion: form.calificacion,
            comentario: form.comentario,
            tipo_calificacion: ratingTarget.type,
          };

          if (ratingTarget.type === 'evento') {
            calificationData.id_evento = ratingTarget.id;
          } else if (ratingTarget.type === 'zona') {
            calificationData.id_zona = ratingTarget.id;
          }

          response = await addCalification(calificationData);
        }

        if (response) {
          Swal.fire({
            title: `Calificación ${isEditMode ? 'actualizada' : 'enviada'}`,
            text: `Tu calificación ha sido ${isEditMode ? 'actualizada' : 'enviada'} exitosamente.`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });

          if (!isEditMode) {
            setForm({ calificacion: 1, comentario: '', referencia: '' });
            setRatingTarget(null);
            setRatingPosition(null);
          }
          router.push('/calificaciones');
        } else {
          throw new Error('No response');
        }
      }
    } catch (error) {
      Swal.fire({
        title: `Error al ${isEditMode ? 'actualizar' : 'enviar'}`,
        text: `No se pudo ${isEditMode ? 'actualizar' : 'enviar'} la calificación. Intenta nuevamente.`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const selectEventForRating = (evento: any) => {
    setRatingTarget({
      type: 'evento', // Coincide con tipo_calificacion del modelo
      id: evento.id_evento,
      referencia: `${evento.tipo_nombre} - ${evento.descripcion}`,
      data: evento
    });
    setRatingPosition({ lat: evento.lat, lng: evento.lng });
    setForm(prev => ({ ...prev, referencia: `${evento.tipo_nombre} - ${evento.descripcion}` }));
    setSelectedEvent(null); // Cerrar InfoWindow
  };

  const selectZoneForRating = (zona: any) => {
    try {
      const geoData = JSON.parse(zona.geojson);
      if (geoData.type === 'Polygon' && geoData.coordinates) {
        const coords = geoData.coordinates[0];
        const avgLat = coords.reduce((sum: number, coord: number[]) => sum + coord[1], 0) / coords.length;
        const avgLng = coords.reduce((sum: number, coord: number[]) => sum + coord[0], 0) / coords.length;

        setRatingTarget({
          type: 'zona', // Cambié de 'zona' a 'zona' para que coincida con el tipo_calificacion
          id: zona.id_zona,
          referencia: `Zona: ${zona.nombre}`,
          data: zona
        });
        setRatingPosition({ lat: avgLat, lng: avgLng });
        setForm(prev => ({ ...prev, referencia: `Zona: ${zona.nombre}` }));
        setSelectedZone(null); // Cerrar InfoWindow
      }
    } catch (error) {
      console.error('Error processing zone:', error);
    }
  };

  const clearRatingSelection = () => {
    setRatingTarget(null);
    setRatingPosition(null);
    setForm({ calificacion: 1, comentario: '', referencia: '' });
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

  // Función para obtener calificaciones de un evento específico
  const getEventRatings = (eventoId: number) => {
    return califications?.filter((cal: any) =>
      cal.tipo_calificacion === 'evento' && cal.id_evento === eventoId
    ) || [];
  };

  // Función para obtener calificaciones de una zona específica
  const getZoneRatings = (zonaId: number) => {
    return califications?.filter((cal: any) =>
      cal.tipo_calificacion === 'zona' && cal.id_zona === zonaId
    ) || [];
  };

  // Función para calcular promedio de calificaciones
  const getAverageRating = (ratings: any[]) => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc: number, rating: any) => acc + (rating.calificacion || 0), 0);
    return (sum / ratings.length).toFixed(1);
  };

  return (
    <div className={`grid gap-4 ${isEditMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
      <div className={`${isEditMode ? 'max-w-2xl mx-auto' : 'col-span-1'} shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 p-5`}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaStar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">
                {isEditMode ? 'Editar Calificación' : 'Calificar Punto de Interés'}
              </span>
              <p className="text-gray-600">
                {isEditMode
                  ? `Editando calificación: ${form.referencia}`
                  : ratingTarget
                    ? `Calificando: ${ratingTarget.referencia}`
                    : "Haz clic en un evento o zona en el mapa para calificar"
                }
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Elemento seleccionado */}
          {ratingTarget && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-blue-800">Elemento seleccionado:</span>
                  <p className="text-sm text-blue-600">{ratingTarget.referencia}</p>
                </div>
                <button
                  type="button"
                  onClick={clearRatingSelection}
                  className="text-red-500 hover:text-red-700 text-sm underline"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

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
                      className={`w-8 h-8 transition-colors ${star <= (hoveredStar || form.calificacion) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
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

            {/* Campo de referencia */}
            <div className="space-y-3">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                📍 Referencia del lugar
              </span>
              <input
                type="text"
                name="referencia"
                placeholder="Describe el lugar que estás calificando..."
                value={form.referencia}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg p-3 shadow-sm transition-colors focus:outline-none focus:border-blue-500 focus:ring-blue-500"
              />
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
              disabled={form.calificacion === 0 || !form.comentario.trim() || (!isEditMode && (!ratingTarget || !form.referencia.trim()))}
            >
              {isEditMode
                ? "Actualizar Calificación"
                : ratingTarget
                  ? "Enviar Calificación"
                  : "Selecciona un punto en el mapa"
              }
            </Button>
          </form>
        </div>
      </div>

      {/* Mapa solo en modo creación */}
      {!isEditMode && (
        <div className="col-span-2 h-[calc(100vh-300px)] rounded-2xl overflow-hidden border border-gray-300 shadow-lg">
          <BaseMap key={`${userPosition ? userPosition.toString() : defaultCenter.toString()}`} center={userPosition || defaultCenter} >

            {/* Tu ubicación */}
            {(userPosition) && <MapMarker position={userPosition} iconSize={{ height: 50, width: 50 }} />}

            {/* Marcador para el punto seleccionado para calificar */}
            {ratingPosition && (
              <MapMarker
                position={ratingPosition}
                iconUrl="/map-icons/iStarMap.png"
                iconSize={{ width: 50, height: 50 }}
              />
            )}

            {/* Renderizar eventos reales */}
            {events?.map((evento: any, ind: number) => (
              <MapMarker
                key={evento?.id_evento || `evento-${ind}`}
                position={{ lat: evento.lat, lng: evento.lng }}
                iconUrl={getIconUrl(evento.tipo_nombre)}
                iconSize={{ width: 40, height: 40 }}
                onClick={() => setSelectedEvent(evento)}
              />
            ))}

            {/* InfoWindow para evento seleccionado */}
            {selectedEvent && (
              <InfoWindow
                position={{ lat: selectedEvent.lat, lng: selectedEvent.lng }}
                onCloseClick={() => setSelectedEvent(null)}
              >
                <div style={{ maxWidth: '300px', maxHeight: '400px', overflowY: 'auto' }}>
                  <strong>{selectedEvent.tipo_nombre}</strong>
                  <br />
                  {selectedEvent.descripcion}
                  <br />
                  <small>{new Date(selectedEvent.fecha_registro).toLocaleDateString()}</small>

                  {/* Mostrar calificaciones existentes */}
                  {(() => {
                    const eventRatings = getEventRatings(selectedEvent.id_evento);
                    const avgRating = getAverageRating(eventRatings);

                    return (
                      <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>
                          📊 Calificaciones ({eventRatings.length})
                          {eventRatings.length > 0 && (
                            <span style={{ color: '#fbbf24' }}> ⭐ {avgRating}</span>
                          )}
                        </div>

                        {eventRatings.length === 0 ? (
                          <div style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>
                            Sin calificaciones aún
                          </div>
                        ) : (
                          <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                            {eventRatings.slice(-3).map((rating: any, index: number) => (
                              <div key={index} style={{
                                fontSize: '11px',
                                marginBottom: '5px',
                                padding: '4px',
                                backgroundColor: 'white',
                                borderRadius: '3px',
                                border: '1px solid #e5e7eb'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span style={{ color: '#fbbf24' }}>
                                    {'⭐'.repeat(rating.calificacion || 0)}
                                  </span>
                                  <span style={{ fontSize: '10px', color: '#6b7280' }}>
                                    {getRatingText(rating.calificacion || 0)}
                                  </span>
                                </div>
                                <div style={{ marginTop: '2px', color: '#374151' }}>
                                  "{rating.comentario}"
                                </div>
                              </div>
                            ))}
                            {eventRatings.length > 3 && (
                              <div style={{ fontSize: '10px', color: '#6b7280', textAlign: 'center' }}>
                                ...y {eventRatings.length - 3} más
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <button
                    onClick={() => selectEventForRating(selectedEvent)}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    style={{ marginTop: '8px' }}
                  >
                    📝 Calificar este evento
                  </button>
                </div>
              </InfoWindow>
            )}

            {/* Renderizar zonas seguras reales */}
            {zones?.map((zona: any, zind: number) => {
              // Parsear el GeoJSON para obtener las coordenadas
              let coordinates: any[] = [];
              try {
                const geoData = JSON.parse(zona.geojson);
                if (geoData.type === 'Polygon' && geoData.coordinates) {
                  // Las coordenadas vienen como [lng, lat], necesitamos convertir a [lat, lng]
                  coordinates = geoData.coordinates[0].map((coord: number[]) => ({
                    lat: coord[1],
                    lng: coord[0]
                  }));
                }
              } catch (error) {
                console.error('Error parsing GeoJSON for zone:', zona.id_zona, error);
              }

              return coordinates.length > 0 ? (
                <Polygon
                  key={zona?.id_zona || `zona-${zind}`}
                  paths={coordinates}
                  options={{
                    fillColor: "#3B82F6",
                    fillOpacity: 0.35,
                    strokeColor: "#1D4ED8",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                  }}
                  onClick={() => setSelectedZone(zona)}
                />
              ) : null;
            })}

            {/* InfoWindow para zona seleccionada */}
            {selectedZone && (
              <InfoWindow
                position={(() => {
                  // Calcular el centro de la zona para mostrar el InfoWindow
                  try {
                    const geoData = JSON.parse(selectedZone.geojson);
                    if (geoData.type === 'Polygon' && geoData.coordinates) {
                      const coords = geoData.coordinates[0];
                      const avgLat = coords.reduce((sum: number, coord: number[]) => sum + coord[1], 0) / coords.length;
                      const avgLng = coords.reduce((sum: number, coord: number[]) => sum + coord[0], 0) / coords.length;
                      return { lat: avgLat, lng: avgLng };
                    }
                  } catch (error) {
                    console.error('Error calculating zone center:', error);
                  }
                  return { lat: -12.127, lng: -76.973 };
                })()}
                onCloseClick={() => setSelectedZone(null)}
              >
                <div style={{ maxWidth: '300px', maxHeight: '400px', overflowY: 'auto' }}>
                  <strong>{selectedZone.nombre}</strong>
                  <br />
                  {selectedZone.descripcion}
                  <br />
                  <small>Área: {selectedZone.area_m2 ? `${Math.round(selectedZone.area_m2)} m²` : 'N/A'}</small>

                  {/* Mostrar calificaciones existentes */}
                  {(() => {
                    const zoneRatings = getZoneRatings(selectedZone.id_zona);
                    const avgRating = getAverageRating(zoneRatings);

                    return (
                      <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>
                          📊 Calificaciones ({zoneRatings.length})
                          {zoneRatings.length > 0 && (
                            <span style={{ color: '#fbbf24' }}> ⭐ {avgRating}</span>
                          )}
                        </div>

                        {zoneRatings.length === 0 ? (
                          <div style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>
                            Sin calificaciones aún
                          </div>
                        ) : (
                          <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                            {zoneRatings.slice(-3).map((rating: any, index: number) => (
                              <div key={index} style={{
                                fontSize: '11px',
                                marginBottom: '5px',
                                padding: '4px',
                                backgroundColor: 'white',
                                borderRadius: '3px',
                                border: '1px solid #e5e7eb'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <span style={{ color: '#fbbf24' }}>
                                    {'⭐'.repeat(rating.calificacion || 0)}
                                  </span>
                                  <span style={{ fontSize: '10px', color: '#6b7280' }}>
                                    {getRatingText(rating.calificacion || 0)}
                                  </span>
                                </div>
                                <div style={{ marginTop: '2px', color: '#374151' }}>
                                  "{rating.comentario}"
                                </div>
                              </div>
                            ))}
                            {zoneRatings.length > 3 && (
                              <div style={{ fontSize: '10px', color: '#6b7280', textAlign: 'center' }}>
                                ...y {zoneRatings.length - 3} más
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <button
                    onClick={() => selectZoneForRating(selectedZone)}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    style={{ marginTop: '8px' }}
                  >
                    📝 Calificar esta zona
                  </button>
                </div>
              </InfoWindow>
            )}

          </BaseMap>
        </div>
      )}
    </div>
  );
}
