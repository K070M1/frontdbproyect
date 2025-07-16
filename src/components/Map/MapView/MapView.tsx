"use client";

import GoogleBaseMap from "@/components/Map/BaseMap";
import {
  MapMarker,
  // Marker, 
  InfoWindow,
  // Polyline, 
  Polygon
} from '@/components/Map/MapShell'
import { useMemo, useState, useEffect, useRef } from "react";
import { FaPerson, FaPersonRunning, FaMapLocationDot, FaRoute } from 'react-icons/fa6'

import { Button } from '@heroui/button'
import { Checkbox } from '@heroui/checkbox'
import { PlacesAutocomplete } from '../PlaceAutcomplete';
import { DirectionsRenderer } from '@react-google-maps/api';

import { useGetEvents } from '@/services/querys/event.query'
import { useGetZones } from '@/services/querys/zone.query'
import { useGetCalifications } from '@/services/querys/calification.query'
import { getRouteSecure } from '@/services/querys/user.query'
import Swal from 'sweetalert2'

import { useSocketStore } from '@/services/socket'
import { useAuth } from '@/context/AuthContext'
import { useLocationUser } from '@/services/querys/user.query'

import styles from "./MapView.module.css";
import dayjs from "dayjs";

export default function MapView() {
  const { emitSocket } = useSocketStore();
  const { user } = useAuth();
  const [startPlace, setStartPlace] = useState<{ placeId?: string; position?: google.maps.LatLngLiteral }>({});
  const [endPlace, setEndPlace] = useState<{ placeId?: string; position?: google.maps.LatLngLiteral }>({});
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const [useCurrentPosition, setUseCurrentPosition] = useState(false);

  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const defaultCenter = useMemo(() => ({ lat: -12.187, lng: -76.973 }), []);
  const [isEditingPosition, setIsEditingPosition] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [showRatingsModal, setShowRatingsModal] = useState(false);
  const [modalRatings, setModalRatings] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [recommendedZones, setRecommendedZones] = useState<any[]>([]); // Zonas seguras recomendadas
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false); // Estado de carga
  const [selectedModalItem, setSelectedModalItem] = useState<{ type: 'event' | 'zone', id: number } | null>(null);

  const { data: events, refetch: refetchEvent } = useGetEvents();
  const { data: zones, refetch: refetchZones } = useGetZones();
  const { data: califications, refetch: refetchCalifications } = useGetCalifications();
  const { mutateAsync: setterLocationUser } = useLocationUser();
  const { mutateAsync: getRouteSecureMutation } = getRouteSecure();

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

  // Función para obtener el texto de la calificación
  const getRatingText = (rating: number) => {
    const ratings = {
      1: "Muy malo",
      2: "Malo",
      3: "Regular",
      4: "Bueno",
      5: "Excelente",
    }
    return ratings[rating as keyof typeof ratings] || "Sin calificar";
  };

  // Función para mostrar modal de calificaciones de evento
  const showEventRatings = (evento: any) => {
    const ratings = getEventRatings(evento.id_evento);
    setModalRatings(ratings);
    setModalTitle(`${evento.tipo_nombre} - Calificaciones`);
    setSelectedModalItem({ type: 'event', id: evento.id_evento });
    setShowRatingsModal(true);
    setSelectedEvent(null);
  };

  // Función para mostrar modal de calificaciones de zona
  const showZoneRatings = (zona: any) => {
    const ratings = getZoneRatings(zona.id_zona);
    setModalRatings(ratings);
    setModalTitle(`${zona.nombre} - Calificaciones`);
    setSelectedModalItem({ type: 'zone', id: zona.id_zona });
    setShowRatingsModal(true);
    setSelectedZone(null);
  };

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

  useEffect(() => {
    const storedPosition = localStorage.getItem("userPosition");
    if (storedPosition) {
      try {
        const parsed = JSON.parse(storedPosition);
        if (parsed.lat && parsed.lng) {
          setUserPosition(parsed);
          return;
        }
      } catch (e) {
        console.warn("Posición guardada no válida:", e);
      }
    }
    currentPositionUser();
  }, []);

  const fetchPlaceDetails = async (placeId: string, isStart: boolean) => {
    if (!window.google?.maps?.places) return;

    if (!placesService.current) {
      placesService.current = new google.maps.places.PlacesService(document.createElement('div'));
    }

    placesService.current.getDetails(
      { placeId, fields: ['geometry'] },
      (place, status) => {
        if (status === 'OK' && place?.geometry?.location) {
          const position = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };

          if (isStart) {
            setStartPlace({ placeId, position });
          } else {
            setEndPlace({ placeId, position });
          }
        }
      }
    );
  };

  const currentPositionUser = () => {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización.");
      return;
    }

    const options = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPosition(current);
      },
      (error) => {
        let errorMessage = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permiso de ubicación denegado. Habilítalo en tu navegador.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Ubicación no disponible. Verifica tu conexión o hardware.";
            break;
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado. Intenta nuevamente.";
            break;
          default:
            errorMessage = "Error desconocido al obtener la ubicación.";
        }
        console.error("Error de geolocalización:", errorMessage, error);
        setLocationError(errorMessage);
      },
      options
    );
  }

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (isEditingPosition && e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const newPosition = { lat, lng };
      setUserPosition(newPosition);
      setIsEditingPosition(false);
    }
  };

  const drawRoute = async () => {
    const origin = useCurrentPosition ? userPosition : startPlace.position;

    if (!origin || !endPlace.position) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan puntos',
        text: 'Por favor selecciona ambos puntos (origen y destino)',
      });
      return;
    }

    setIsCalculatingRoute(true);

    try {
      // 1. Calcular la ruta con Google Maps
      const directionsService = new google.maps.DirectionsService();

      const directionsResult = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        directionsService.route(
          {
            origin: origin,
            destination: endPlace.position!,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === 'OK' && result) {
              resolve(result);
            } else {
              reject(new Error(`Error calculando ruta: ${status}`));
            }
          }
        );
      });

      setDirections(directionsResult);

      // 2. Consultar zonas seguras al backend
      const routeData = {
        origen: {
          lat: origin.lat,
          lon: origin.lng
        },
        destino: {
          lat: endPlace.position.lat,
          lon: endPlace.position.lng
        },
        radio_evento: 500  // metros
      };

      const secureZones = await getRouteSecureMutation(routeData as any);

      if (secureZones && secureZones.length > 0) {
        console.log('Zonas seguras encontradas:', secureZones);
        setRecommendedZones(secureZones);
        Swal.fire({
          icon: 'success',
          title: '¡Ruta calculada!',
          text: `Se encontraron ${secureZones.length} rutas seguras recomendadas en tu ruta (marcadas en verde).`,
        });
      } else {
        console.log('No se encontraron rutas seguras en la ruta');
        setRecommendedZones([]);
        Swal.fire({
          icon: 'info',
          title: 'Ruta calculada',
          text: 'No se encontraron rutas seguras específicas para esta ruta, pero puedes ver las zonas generales en el mapa.',
        });
      }

    } catch (error) {
      console.error('Error al calcular ruta segura:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al calcular ruta segura',
        text: 'Intenta nuevamente.',
      });
    } finally {
      setIsCalculatingRoute(false);
    }
  }

  const resetRoute = () => {
    setStartPlace({ placeId: undefined, position: undefined });
    setEndPlace({ placeId: undefined, position: undefined });
    setDirections(null);
    setRecommendedZones([]); // Limpiar zonas recomendadas
    const startInput = document.querySelector('input[placeholder="Ingresa un punto inicial"]') as HTMLInputElement;
    const endInput = document.querySelector('input[placeholder="Ingresa un punto final"]') as HTMLInputElement;
    if (startInput) startInput.value = '';
    if (endInput) endInput.value = '';
    setUseCurrentPosition(false);
  }

  useEffect(() => {
    const fnSetterLocationUser = async () => {
      if (userPosition) {
        if (user?.id_usuario) {
          await setterLocationUser({
            id: user.id_usuario,
            form: {
              lat: userPosition.lat,
              lon: userPosition.lng
            }
          });
        }
        localStorage.setItem("userPosition", JSON.stringify(userPosition));
      }
    }
    fnSetterLocationUser();
  }, [userPosition]);

  // Socket
  useEffect(() => {
    if (emitSocket) {
      if (emitSocket.status == "ok") {
        const data = emitSocket.data;
        console.log("----Socket data received:", data);
        if (data?.process == "changes_event" && data?.action == "event") {
          refetchEvent();
        }

        if (data?.process == "changes_calification" && data?.action == "event") {
          refetchCalifications();
        }

        if (data?.process == "changes_zone" && data?.action == "event") {
          refetchZones();
        }
      }
    }
  }, [emitSocket])

  // Actualizar modal de calificaciones cuando cambien las calificaciones
  useEffect(() => {
    if (showRatingsModal && selectedModalItem && califications) {
      if (selectedModalItem.type === 'event') {
        const updatedRatings = getEventRatings(selectedModalItem.id);
        setModalRatings(updatedRatings);
      } else if (selectedModalItem.type === 'zone') {
        const updatedRatings = getZoneRatings(selectedModalItem.id);
        setModalRatings(updatedRatings);
      }
    }
  }, [califications, showRatingsModal, selectedModalItem]);

  return (
    <div className={styles.mapContainer}>
      <Button
        startContent={isEditingPosition ? <FaPersonRunning className={styles.iconSmall} /> : <FaPerson className={styles.iconSmall} />}
        className={styles.togglePositionButton}
        radius="md"
        onPress={() => setIsEditingPosition(!isEditingPosition)}
      >
        {isEditingPosition ? "Cambiando posición..." : "Cambiar mi posición"}
      </Button>

      <div className={styles.formContainer}>
        <h3 className={styles.formTitle}>Formulario</h3>

        <div className={styles.formFields}>
          <div className={styles.fieldGroup}>
            <PlacesAutocomplete
              disabled={Boolean(useCurrentPosition)}
              placeholder="Ingresa un punto inicial"
              onPlaceSelected={(placeId) => fetchPlaceDetails(placeId, true)}
            // className={styles.autocompleteInput}
            />
            <div className={styles.checkboxContainer}>
              <Checkbox isSelected={Boolean(useCurrentPosition)} onValueChange={setUseCurrentPosition} >
                Usar mi posición actual
              </Checkbox>
              {useCurrentPosition && userPosition && (
                <p className={styles.statusSuccess}>✓ Usando tu ubicación actual</p>
              )}
              {useCurrentPosition && !userPosition && (
                <p className={styles.statusWarning}>⚠ Obteniendo tu ubicación...</p>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <PlacesAutocomplete
              placeholder="Ingresa un punto final"
              onPlaceSelected={(placeId) => fetchPlaceDetails(placeId, false)}
            // className={styles.autocompleteInput}
            />
            {endPlace.position && (
              <p className={styles.statusSuccess}>✓ Destino seleccionado</p>
            )}
          </div>

          <Button
            startContent={<FaRoute className={styles.iconSmall} />}
            className={styles.calculateButton}
            radius="md"
            onPress={() => { drawRoute() }}
            isDisabled={isCalculatingRoute || (!useCurrentPosition && !startPlace.position) || !endPlace.position}
            isLoading={isCalculatingRoute}
          >
            {isCalculatingRoute ? 'Calculando...' : 'Calcular ruta segura'}
          </Button>

          {directions && (
            <Button
              startContent={<FaMapLocationDot className={styles.iconSmall} />}
              className={styles.clearButton}
              radius="md"
              onPress={() => { resetRoute() }}
            >
              Limpiar ruta segura
            </Button>
          )}
        </div>
      </div>

      <GoogleBaseMap center={userPosition || defaultCenter} onClick={handleMapClick} >
        {(userPosition) && (
          <MapMarker
            position={userPosition}
          />
        )}

        {/* Marcador de punto de inicio (solo cuando NO usa ubicación actual) */}
        {!useCurrentPosition && startPlace.position && (
          <MapMarker
            position={startPlace.position}
            iconUrl="/map-icons/iPersonMap.png"
            iconSize={{ width: 40, height: 40 }}
          />
        )}

        {/* Marcador de destino (siempre que haya destino) */}
        {endPlace.position && (
          <MapMarker
            position={endPlace.position}
            iconUrl="/map-icons/iMetaMap.png"
            iconSize={{ width: 40, height: 40 }}
          />
        )}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#3b82f6",
                strokeOpacity: 0.8,
                strokeWeight: 5,
              },
              suppressMarkers: true
            }}
          />
        )}

        {locationError && (
          <div className={styles.locationError}>
            Error: {locationError}
          </div>
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
            <div className={styles.infoWindowContent}>
              <strong>{selectedEvent.tipo_nombre}</strong>
              <br />
              {selectedEvent.descripcion}
              <br />
              <small>{new Date(selectedEvent.fecha_registro).toLocaleDateString()}</small>
              <br />
              {(() => {
                const eventRatings = getEventRatings(selectedEvent.id_evento);
                const avgRating = getAverageRating(eventRatings);
                return (
                  <div className={styles.ratingWrapper}>
                    <div className={styles.eventRatingInfo}>
                      📊 {eventRatings.length} calificaciones
                      {eventRatings.length > 0 && (
                        <span className={styles.ratingStar}> ⭐ {avgRating}</span>
                      )}
                    </div>
                    <button
                      onClick={() => showEventRatings(selectedEvent)}
                      className={styles.ratingButton}
                    >
                      {eventRatings.length === 0 ? "Sin calificaciones" : "Ver calificaciones"}
                    </button>
                  </div>
                );
              })()}
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
          // Determinar colores según si la zona es insegura o no
          const zoneColors = zona.inseguro ? {
            fillColor: "#DC2626",    // Rojo para zonas inseguras
            fillOpacity: 0.4,
            strokeColor: "#991B1B",  // Rojo más oscuro para el borde
            strokeOpacity: 0.9,
            strokeWeight: 3,
          } : {
            fillColor: "#10B981",    // Verde para zonas seguras
            fillOpacity: 0.35,
            strokeColor: "#059669",  // Verde más oscuro para el borde
            strokeOpacity: 0.8,
            strokeWeight: 2,
          };
          return coordinates.length > 0 ? (
            <Polygon
              key={zona?.id_zona || `zona-${zind}`}
              paths={coordinates}
              options={zoneColors}
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
              return { lat: -12.187, lng: -76.973 };
            })()}
            onCloseClick={() => setSelectedZone(null)}
          >
            <div className={styles.infoWindowContent}>
              {selectedZone.isRecommended && (
                <div className={styles.zoneRecommended}>
                  🎯 ZONA RECOMENDADA PARA TU RUTA
                </div>
              )}
              <strong>{selectedZone.nombre}</strong>
              <br />
              {selectedZone.descripcion}
              <br />
              <small>Área: {selectedZone.area_m2 ? `${Math.round(selectedZone.area_m2)} m²` : 'N/A'}</small>
              <br />
              {(() => {
                const zoneRatings = getZoneRatings(selectedZone.id_zona);
                const avgRating = getAverageRating(zoneRatings);
                return (
                  <div className={styles.ratingWrapper}>
                    <div className={styles.ratingInfoBox}>
                      📊 {zoneRatings.length} calificaciones
                      {zoneRatings.length > 0 && (
                        <span className={styles.ratingStar}> ⭐ {avgRating}</span>
                      )}
                    </div>
                    <button
                      onClick={() => showZoneRatings(selectedZone)}
                      className={styles.ratingButton}
                    >
                      {zoneRatings.length === 0 ? "Sin calificaciones" : "Ver calificaciones"}
                    </button>
                  </div>
                );
              })()}
            </div>
          </InfoWindow>
        )}

        {/* Renderizar zonas seguras recomendadas (con estilo destacado) */}
        {recommendedZones?.map((zona: any, zind: number) => {
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
            console.error('Error parsing GeoJSON for recommended zone:', zona.id_zona, error);
          }
          return coordinates.length > 0 ? (
            <Polygon
              key={`recommended-${zona?.id_zona || zind}`}
              paths={coordinates}
              options={{
                fillColor: "#10B981", // Verde más vibrante para zonas recomendadas
                fillOpacity: 0.6,     // Más opaco
                strokeColor: "#059669",
                strokeOpacity: 1,
                strokeWeight: 3,      // Borde más grueso
                zIndex: 1000         // Encima de las otras zonas
              }}
              onClick={() => setSelectedZone({ ...zona, isRecommended: true })}
            />
          ) : null;
        })}
      </GoogleBaseMap>

      {/* Modal de calificaciones */}
      {showRatingsModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {/* Header del modal */}
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{modalTitle}</h3>
              <button
                onClick={() => {
                  setShowRatingsModal(false);
                  setSelectedModalItem(null);
                }}
                className={styles.modalCloseButton}
              >
                X
              </button>
            </div>

            {/* Resumen de calificaciones */}
            {modalRatings.length > 0 && (
              <div className={styles.modalSummary}>
                <div className={styles.modalSummaryInfo}>
                  <span className={styles.modalSummaryCount}>
                    {modalRatings.length} calificación{modalRatings.length !== 1 ? 'es' : ''}
                  </span>
                  <div className={styles.modalSummaryStars}>
                    <span className={styles.startIcon}>⭐</span>
                    <span className={styles.startIcon2}>
                      {getAverageRating(modalRatings)}
                      </span>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de calificaciones */}
            <div className={styles.modalList}>
              {modalRatings.length === 0 ? (
                <div className={styles.noRatings}>
                  <span>📊</span>
                  <p>No hay calificaciones aún</p>
                  <p>Sé el primero en calificar este lugar</p>
                </div>
              ) : (
                modalRatings.map((rating: any, index: number) => (
                  <div key={index} className={styles.ratingCard}>
                    {/* Estrellas y calificación */}
                    <div className={styles.ratingHeader}>
                      <div className={styles.ratingStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= (rating.calificacion || 0)
                              ? styles.starActive
                              : styles.starInactive}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className={styles.ratingText}>
                        {getRatingText(rating.calificacion || 0)}
                      </span>
                      <span className={styles.ratingDate}>
                        {dayjs(rating.updated_at).format("DD/MM/YYYY HH:mm a")}
                      </span>
                    </div>

                    {/* Comentario */}
                    <p className={styles.ratingComment}>
                      {rating.comentario}
                      </p>
                  </div>
                ))
              )}
            </div>

            {/* Footer del modal */}
            <div className={styles.modalFooter}>
              <button
                onClick={() => {
                  setShowRatingsModal(false);
                  setSelectedModalItem(null);
                }}
                className={styles.modalCloseAction}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
