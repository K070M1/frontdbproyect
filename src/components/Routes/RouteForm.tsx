"use client";

import { useState, useRef, useEffect, use } from "react";
import { useAuth } from '@/context/AuthContext'
import { useAddRoute } from '@/services/querys/routes.query'
import { PlacesAutocomplete } from "@/components/Map/PlaceAutcomplete";
import BaseMap from "@/components/Map/BaseMap";
import styles from "./RouteForm.module.css";

export default function RouteForm() {
  const [form, setForm] = useState({
    riesgo: 1,
    tiempo_estimado: "",
    favorito: false,
  });

  const { mutateAsync:addRoute } = useAddRoute()
  const { user } = useAuth()
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [origenCoords, setOrigenCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [destinoCoords, setDestinoCoords] = useState<{ lat: number; lng: number } | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [route, setRoute] = useState<google.maps.DirectionsResult | null >(null);

  const fetchPlaceDetails = (placeId: string, isOrigen: boolean) => {
    if (!window.google?.maps?.places) return;
    if (!placesService.current) {
      placesService.current = new google.maps.places.PlacesService(
        document.createElement("div")
      );
    }

    placesService.current.getDetails(
      { placeId, fields: ["geometry", "name"] },
      (place:any, status:any) => {
        if (status === "OK" && place?.geometry?.location) {
          const position = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          if (isOrigen) {
            setOrigen(place.name || "");
            setOrigenCoords(position);
          } else {
            setDestino(place.name || "");
            setDestinoCoords(position);
          }

          setTimeout(() => {
            const start = isOrigen ? position : origenCoords;
            const end = isOrigen ? destinoCoords : position;

            if (start && end) {
              const directionsService = new google.maps.DirectionsService();
              directionsService.route(
                {
                  origin: start,
                  destination: end,
                  travelMode: google.maps.TravelMode.DRIVING, // Auto
                },
                (result, status) => {
                  if (status === "OK") {
                    setRoute(result);

                    const durationInSeconds =
                      result?.routes[0]?.legs[0]?.duration?.value || 0;
                    const hours = Math.floor(durationInSeconds / 3600);
                    const minutes = Math.floor((durationInSeconds % 3600) / 60);
                    const seconds = durationInSeconds % 60;

                    const formatted = [
                      hours.toString().padStart(2, "0"),
                      minutes.toString().padStart(2, "0"),
                      seconds.toString().padStart(2, "0"),
                    ].join(":");

                    setForm((prev) => ({
                      ...prev,
                      tiempo_estimado: formatted,
                    }));
                  }
                }
              );
            }
          }, 100);
        }
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? e.target.checked
          : name === "riesgo"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const res = await addRoute({
      ...form,
      origen,
      destino,
      origenCoords,
      destinoCoords,
      id_usuario: user?.id,
    });

    if(res){
      console.log("Ruta registrada exitosamente:", res);
    }
  };

  return (
    <div className={styles.container}>
      <form
        onSubmit={handleSubmit}
        className="col-span-2 flex flex-col justify-between bg-white p-8 rounded-2xl shadow-lg border border-gray-200 h-[700px]"
      >
        <div className="space-y-8">
          {/* <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
            Registrar Ruta
          </h2> */}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-base font-semibold text-gray-700 block">
                Origen
              </label>
              <PlacesAutocomplete
                placeholder="Selecciona el origen"
                onPlaceSelected={(placeId) => fetchPlaceDetails(placeId, true)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-base font-semibold text-gray-700 block">
                Destino
              </label>
              <PlacesAutocomplete
                placeholder="Selecciona el destino"
                onPlaceSelected={(placeId) => fetchPlaceDetails(placeId, false)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-base font-semibold text-gray-700 block">
                Nivel de Riesgo
              </label>
              <div className="flex items-center space-x-3">
                <input
                  name="riesgo"
                  type="range"
                  value={form.riesgo}
                  onChange={handleChange}
                  min={1}
                  max={10}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-2xl font-bold text-indigo-600 min-w-[3ch] text-center">
                  {form.riesgo}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Bajo</span>
                <span>Alto</span>
              </div>
            </div>

            {isMounted && (
              <div className="space-y-2">
                <label className="text-base font-semibold text-gray-700 block">
                  Tiempo Estimado
                </label>
                <input
                  name="tiempo_estimado"
                  value={form.tiempo_estimado}
                  readOnly
                  className="w-full p-4 text-base border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-mono"
                  placeholder="HH:MM:SS"
                />
              </div>
            )}

            <div className="pt-4">
              <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  name="favorito"
                  checked={form.favorito}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                />
                <span className="text-base font-medium text-gray-700">
                  Marcar como ruta favorita
                </span>
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Guardar Ruta
        </button>
      </form>

      <div className="col-span-6 h-[700px] rounded-2xl overflow-hidden border border-gray-300 shadow-lg">
        <BaseMap
          center={
            origenCoords || destinoCoords || { lat: -12.0464, lng: -77.0428 }
          }
          markers={[origenCoords, destinoCoords].filter((coords): coords is { lat: number; lng: number } => coords !== null)}
          directions={route || undefined}
        />
      </div>
    </div>
  );
}
