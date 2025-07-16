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
import { useSocketStore } from '@/services/socket';
import Swal from 'sweetalert2'
import styles from "./RatingForm.module.css";

type RatingFormProps = {
  id_usuario?: number;
  initialData?: any; // Para el modo de edición
};

export default function RatingForm({ id_usuario, initialData }: RatingFormProps) {
  const router = useRouter();
  const { sendSocket } = useSocketStore();
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

          sendSocket({
            process: "changes_calification",
            action: "event",
            data: {
              response: response
            }
          })

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
    <div className={isEditMode ? styles.gridOneCol : styles.gridThreeCols}>
      <div className={isEditMode ? styles.formFullWidth : styles.formSidebar}>
        <div className={styles.header}>
          <div className={styles.iconBox}>
            <FaStar className={styles.icon} />
          </div>
          <div className={styles.titleBox}>
            <span className={styles.headingText}>
              {isEditMode ? 'Editar Calificación' : 'Calificar Punto de Interés'}
            </span>
            <p className={styles.paragraphText}>
              {isEditMode
                ? `Editando calificación: ${form.referencia}`
                : ratingTarget
                  ? `Calificando: ${ratingTarget.referencia}`
                  : "Haz clic en un evento o zona en el mapa para calificar"
              }
            </p>
          </div>
          
        </div>

        <div className={styles.content}>
          {/* Elemento seleccionado */}
          {ratingTarget && (
            <div className={styles.selectionBox}>
              <div className={styles.selectionRow}>
                <div className={styles.selectionInfo}>
                  <span className={styles.selectionLabel}>Elemento seleccionado:</span>
                  <p className={styles.selectionText}>{ratingTarget.referencia}</p>
                </div>
                <button
                  type="button"
                  onClick={clearRatingSelection}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>
                <FaStar className={styles.iconPuntuacion} />
                Puntuación
              </span>
              <div className={styles.starsWrapper}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className={styles.starButton}
                  >
                    <FaStar
                      className={`${styles.starIcon} ${star <= (hoveredStar || form.calificacion) ? styles.starActive : styles.starInactive}`}
                    />

                  </button>
                ))}
              </div>
              <div className={styles.ratingWrapper}>
                {form.calificacion > 0 && (
                  <div className={styles.ratingDisplay}>
                    {getRatingText(form.calificacion)}
                  </div>
                )}
              </div>
            </div>

            {/* Campo de referencia */}
            <div className={styles.field}>
              <span className={styles.fieldLabel}>
                📍 Referencia del lugar
              </span>
              <input
                type="text"
                name="referencia"
                placeholder="Describe el lugar que estás calificando..."
                value={form.referencia}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            {/* Campo de comentario */}
            <div className={styles.field}>
              <span className={styles.fieldLabel}>
                <FaComment className={styles.fieldIcon} />
                Comentario
              </span>
              <textarea
                id="comentario"
                name="comentario"
                placeholder="Cuéntanos sobre tu experiencia en este lugar..."
                value={form.comentario}
                onChange={handleChange}
                required
                className={styles.textarea}
              ></textarea>
              <div className={styles.charCount}>{form.comentario.length}/500 caracteres</div>
            </div>

            {/* Botón de envío */}
            <Button
              type="submit"
              className={styles.submitButton}
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
        <div className={styles.mapContainer}>
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
                <div className={styles.infoWindow}>
                  <strong>{selectedEvent.tipo_nombre}</strong>
                  <p>
                    {selectedEvent.descripcion}
                  </p>
                  <small>{new Date(selectedEvent.fecha_registro).toLocaleDateString()}</small>

                  {/* Mostrar calificaciones existentes */}
                  {(() => {
                    const eventRatings = getEventRatings(selectedEvent.id_evento);
                    const avgRating = getAverageRating(eventRatings);

                    return (
                      <div className={styles.ratingsContainer}>
                        <div className={styles.ratingsHeader}>
                          📊 Calificaciones ({eventRatings.length})
                          {eventRatings.length > 0 && (
                            <span className={styles.avgRating}> ⭐ {avgRating}</span>
                          )}
                        </div>

                        {eventRatings.length === 0 ? (
                          <div className={styles.noRatings}>
                            Sin calificaciones aún
                          </div>
                        ) : (
                          <div className={styles.ratingsList}>
                            {eventRatings.slice(-3).map((rating: any, index: number) => (
                              <div key={index} className={styles.ratingCard}>
                                <div className={styles.ratingRow}>
                                  <span className={styles.stars}>
                                    {'⭐'.repeat(rating.calificacion || 0)}
                                  </span>
                                  <span className={styles.ratingLabel}>
                                    {getRatingText(rating.calificacion || 0)}
                                  </span>
                                </div>
                                <div className={styles.comment}>
                                  "{rating.comentario}"
                                </div>
                              </div>
                            ))}
                            {eventRatings.length > 3 && (
                              <div className={styles.moreIndicator}>
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
                    className={styles.actionButton}
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
                <div className={styles.infoWindow}>
                  <strong>{selectedZone.nombre}</strong>
                  <p>
                    {selectedZone.descripcion}
                  </p>
                  <small>Área: {selectedZone.area_m2 ? `${Math.round(selectedZone.area_m2)} m²` : 'N/A'}</small>

                  {/* Mostrar calificaciones existentes */}
                  {(() => {
                    const zoneRatings = getZoneRatings(selectedZone.id_zona);
                    const avgRating = getAverageRating(zoneRatings);

                    return (
                      <div className={styles.ratingsContainer}>
                        <div className={styles.ratingsHeader}>
                          📊 Calificaciones ({zoneRatings.length})
                          {zoneRatings.length > 0 && (
                            <span className={styles.avgRating}> ⭐ {avgRating}</span>
                          )}
                        </div>
                        {zoneRatings.length === 0 ? (
                          <div className={styles.noRatings}>
                            Sin calificaciones aún
                          </div>
                        ) : (
                          <div className={styles.ratingsList}>
                            {zoneRatings.slice(-3).map((rating: any, index: number) => (
                              <div key={index} className={styles.ratingCard}>
                                <div className={styles.ratingRow}>
                                  <span className={styles.stars}>
                                    {'⭐'.repeat(rating.calificacion || 0)}
                                  </span>
                                  <span className={styles.ratingLabel}>
                                    {getRatingText(rating.calificacion || 0)}
                                  </span>
                                </div>
                                <div className={styles.comment}>
                                  "{rating.comentario}"
                                </div>
                              </div>
                            ))}
                            {zoneRatings.length > 3 && (
                              <div className={styles.moreIndicator}>
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
                    className={styles.actionButton}
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
