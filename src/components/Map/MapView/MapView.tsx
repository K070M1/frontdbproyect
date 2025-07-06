"use client";

import GoogleBaseMap from "@/components/Map/BaseMap";
import { MapMarker, Marker, InfoWindow, Polyline, Polygon } from '@/components/Map/MapShell'
import { useMemo, useState, useEffect, useRef } from "react";
import { FaPerson, FaPersonRunning, FaMapLocationDot, FaRoute } from 'react-icons/fa6'

import { Button } from '@heroui/button'
import { Checkbox } from '@heroui/checkbox'
import { PlacesAutocomplete } from '../PlaceAutcomplete';
import { DirectionsRenderer } from '@react-google-maps/api';

import { useGetEvents } from '@/services/querys/event.query'
import { useGetZones } from '@/services/querys/zone.query'
import { useGetCalifications } from '@/services/querys/calification.query'

import styles from "./MapView.module.css";

export default function MapView() {
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

  const { data: events } = useGetEvents();
  const { data: zones } = useGetZones();
  const { data: califications } = useGetCalifications();

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
    setShowRatingsModal(true);
    setSelectedEvent(null);
  };

  // Función para mostrar modal de calificaciones de zona
  const showZoneRatings = (zona: any) => {
    const ratings = getZoneRatings(zona.id_zona);
    setModalRatings(ratings);
    setModalTitle(`${zona.nombre} - Calificaciones`);
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

  const drawRoute = () => {
     const origin = useCurrentPosition ? userPosition : startPlace.position;

    if (!origin || !endPlace.position) {
      alert('Por favor selecciona ambos puntos (origen y destino)');
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: endPlace.position,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
        }
      }
    );
  }

  const resetRoute = () => {
    setStartPlace({ placeId: undefined, position: undefined });
    setEndPlace({ placeId: undefined, position: undefined });
    setDirections(null);
    const startInput = document.querySelector('input[placeholder="Ingresa un punto inicial"]') as HTMLInputElement;
    const endInput = document.querySelector('input[placeholder="Ingresa un punto final"]') as HTMLInputElement;
    if (startInput) startInput.value = '';
    if (endInput) endInput.value = '';
    setUseCurrentPosition(false);
  }

  useEffect(() => {
    if (userPosition) {
      localStorage.setItem("userPosition", JSON.stringify(userPosition));
    }
  }, [userPosition]);

  return (
    <div className={styles.mapContainer}>
      <Button 
        startContent={isEditingPosition ? <FaPersonRunning className="size-4"/> : <FaPerson className="size-4"/>} 
        className="absolute top-5 left-5 z-50 flex flex-row gap-2 rounded-sm bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:scale-110 hover:rotate-2 hover:cursor-pointer shadow-md!"
        radius="md" onPress={() => setIsEditingPosition(!isEditingPosition)}
      >
        {isEditingPosition ? "Cambiando posición..." : "Cambiar mi posición"}
      </Button>
      <div className="flex flex-col gap-1 absolute bg-white/60 bottom-10 left-5 z-50 p-5 rounded-md items-center justify-center">
        <h3 className="font-semibold text-center">Formulario</h3>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <PlacesAutocomplete
              disabled={Boolean(useCurrentPosition)}
              placeholder="Ingresa un punto inicial"
              onPlaceSelected={(placeId) => fetchPlaceDetails(placeId, true)}
            />
            <div className="mx-2">
              <Checkbox isSelected={Boolean(useCurrentPosition)} onValueChange={setUseCurrentPosition} >
                Usar mi posición actual
              </Checkbox>
            </div>
          </div>
          <div>
            <PlacesAutocomplete
              placeholder="Ingresa un punto final"
              onPlaceSelected={(placeId) => fetchPlaceDetails(placeId, false)}
            />
          </div>
          <Button 
            startContent={<FaRoute className="size-4"/>} 
            className="flex flex-row gap-2 rounded-sm bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:cursor-pointer shadow-md!"
            radius="md" onPress={() => { drawRoute() }}
          >
            Calcular ruta segura
          </Button>
          {
            directions && (
              <Button 
                startContent={<FaMapLocationDot className="size-4"/>} 
                className="flex flex-row gap-2 rounded-sm bg-red-600 px-4 py-3 text-sm font-medium text-white hover:cursor-pointer shadow-md!"
                radius="md" onPress={() => { resetRoute() }}
              >
                Limpiar ruta segura
              </Button>
            )
          }
        </div>
      </div>
      <GoogleBaseMap center={userPosition || defaultCenter} onClick={handleMapClick} >

        {(userPosition) && (
          <MapMarker
            position={userPosition}
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
            <div>
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
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      📊 {eventRatings.length} calificaciones
                      {eventRatings.length > 0 && (
                        <span style={{ color: '#fbbf24' }}> ⭐ {avgRating}</span>
                      )}
                    </div>
                    <button
                      onClick={() => showEventRatings(selectedEvent)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      style={{ fontSize: '12px' }}
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
              return { lat: -12.187, lng: -76.973 };
            })()}
            onCloseClick={() => setSelectedZone(null)}
          >
            <div>
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
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      📊 {zoneRatings.length} calificaciones
                      {zoneRatings.length > 0 && (
                        <span style={{ color: '#fbbf24' }}> ⭐ {avgRating}</span>
                      )}
                    </div>
                    <button
                      onClick={() => showZoneRatings(selectedZone)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      style={{ fontSize: '12px' }}
                    >
                      {zoneRatings.length === 0 ? "Sin calificaciones" : "Ver calificaciones"}
                    </button>
                  </div>
                );
              })()}
            </div>
          </InfoWindow>
        )}
      </GoogleBaseMap>

      {/* Modal de calificaciones */}
      {showRatingsModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto mx-4">
            {/* Header del modal */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{modalTitle}</h3>
              <button
                onClick={() => setShowRatingsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Resumen de calificaciones */}
            {modalRatings.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {modalRatings.length} calificación{modalRatings.length !== 1 ? 'es' : ''}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm font-medium">
                      {getAverageRating(modalRatings)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de calificaciones */}
            <div className="space-y-3">
              {modalRatings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">📊</div>
                  <p className="text-gray-500">No hay calificaciones aún</p>
                  <p className="text-gray-400 text-sm">Sé el primero en calificar este lugar</p>
                </div>
              ) : (
                modalRatings.map((rating: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    {/* Estrellas y calificación */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-lg ${
                                star <= (rating.calificacion || 0) 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {getRatingText(rating.calificacion || 0)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Comentario */}
                    <p className="text-gray-700 text-sm leading-relaxed">
                      "{rating.comentario}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Footer del modal */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowRatingsModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
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
