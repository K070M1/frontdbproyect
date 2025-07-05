"use client";

import { mockEventos } from "@/data/mockEventos";
import { mockRutas } from "@/data/mockRutas";
import { mockZonas } from "@/data/mockZonas";
import { mockCalificaciones } from "@/data/mockCalificaciones";
import GoogleBaseMap from "@/components/Map/BaseMap";
import { MapMarker, Marker, InfoWindow, Polyline, Polygon } from '@/components/Map/MapShell'
import { useMemo, useState, useEffect, useRef } from "react";
import { FaPerson, FaPersonRunning, FaMapLocationDot, FaRoute } from 'react-icons/fa6'

import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Checkbox } from '@heroui/checkbox'
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete'
import { PlacesAutocomplete } from '../PlaceAutcomplete';
import { DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

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

        {mockEventos.map((evento: any, ind) => (
          <Marker 
            key={(evento?.id || "s") + ind} 
            position={evento.position || { lat: 0, lng: 0 }}
          >
          </Marker>
        ))}

        {mockRutas.map((ruta: any) => (
          <Polyline
            key={ruta.id_ruta}
            path={ruta.positions}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 1.0,
              strokeWeight: 2,
            }}
          />
        ))}

        {mockZonas.map((zona: any, zind) => (
          <Polygon
            key={zona?.id || "zon" + zind}
            paths={zona.coordinates}
            options={{
              fillColor: "#FF0000",
              fillOpacity: 0.35,
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        ))}

        {mockCalificaciones
          ?.filter((c: any) => c?.ubicacion)
          ?.map((c: any) => (
            <Marker
              key={c.id}
              position={c.ubicacion!}
            >
              <InfoWindow>
                <div>
                  <strong>{c.referencia}</strong>
                  <br />
                  {c.comentario}
                </div>
              </InfoWindow>
            </Marker>
          ))}
      </GoogleBaseMap>
    </div>
  );
}
