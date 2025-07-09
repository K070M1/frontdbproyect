"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAddRoute } from "@/services/querys/routes.query";
import { PlacesAutocomplete } from "@/components/Map/PlaceAutcomplete";
import BaseMap from "@/components/Map/BaseMap";
import styles from "./RouteForm.module.css";

export default function RouteForm() {
  const [form, setForm] = useState({
    riesgo: 1,
    tiempo_estimado: "",
    favorito: false,
  });

  const { mutateAsync: addRoute } = useAddRoute();
  const { user } = useAuth();
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [origenAddress, setOrigenAddress] = useState("");
  const [destinoAddress, setDestinoAddress] = useState("");
  const [origenCoords, setOrigenCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [destinoCoords, setDestinoCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [route, setRoute] = useState<google.maps.DirectionsResult | null>(null);

  const getRiskLevel = (value: number) => {
    if (value <= 3) return "bajo";
    if (value <= 7) return "medio";
    return "alto";
  };

  const getRiskLabel = (value: number) => {
    if (value <= 3) return "Bajo";
    if (value <= 7) return "Medio";
    return "Alto";
  };

  const fetchPlaceDetails = (placeId: string, isOrigen: boolean) => {
    if (!window.google?.maps?.places) return;
    if (!placesService.current) {
      placesService.current = new google.maps.places.PlacesService(
        document.createElement("div")
      );
    }

    placesService.current.getDetails(
      {
        placeId,
        fields: [
          "geometry",
          "name",
          "formatted_address",
          "address_components",
          "vicinity",
        ],
      },
      (place: any, status: any) => {
        if (status === "OK" && place?.geometry?.location) {
          const position = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          // Extraer componentes de dirección para un formato más detallado
          let detailedAddress = place.formatted_address || "";

          // Si quieres puedes procesar address_components para más detalle
          if (place.address_components) {
            // Aquí podrías extraer distrito, ciudad, etc. de forma más específica
            // pero formatted_address ya incluye toda esta información
          }

          if (isOrigen) {
            setOrigen(place.name || "");
            setOrigenAddress(detailedAddress);
            setOrigenCoords(position);
          } else {
            setDestino(place.name || "");
            setDestinoAddress(detailedAddress);
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

    // Convertir el riesgo de 1-10 a 1-5 para la base de datos
    const riesgoNormalizado = Math.ceil(form.riesgo / 2);

    const res = await addRoute({
      ...form,
      riesgo: riesgoNormalizado,
      origen,
      destino,
      origenAddress,
      destinoAddress,
      origenCoords,
      destinoCoords,
      id_usuario: user?.id,
    });

    if (res) {
      console.log("Ruta registrada exitosamente:", res);
    }
  };

  const formatTimeDisplay = (tiempo: string) => {
    if (!tiempo) return { hours: "--", minutes: "--", seconds: "--" };
    const [h, m, s] = tiempo.split(":");
    return {
      hours: h || "--",
      minutes: m || "--",
      seconds: s || "--",
    };
  };

  const timeDisplay = formatTimeDisplay(form.tiempo_estimado);

  return (
    <div className={styles.container}>
      <form
        onSubmit={handleSubmit}
        className={`${styles.formContainer} col-span-2`}
      >
        <div className="space-y-8">
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
              <div className={styles.riskContainer}>
                <div className={styles.riskSliderWrapper}>
                  <input
                    name="riesgo"
                    type="range"
                    value={form.riesgo}
                    onChange={handleChange}
                    min={1}
                    max={10}
                    className={`${styles.riskSlider} ${
                      styles[getRiskLevel(form.riesgo)]
                    }`}
                  />
                  <div className={styles.riskMarkers}>
                    <span className={styles.marker}></span>
                    <span className={styles.marker}></span>
                    <span className={styles.marker}></span>
                  </div>
                </div>
                <span
                  className={`${styles.riskValue} ${
                    styles[getRiskLevel(form.riesgo)]
                  }`}
                >
                  {getRiskLabel(form.riesgo)}
                </span>
              </div>
              <div className={styles.riskLabels}>
                <span>Bajo</span>
                <span>Medio</span>
                <span>Alto</span>
              </div>
            </div>

            {isMounted && (
              <div className="space-y-2">
                <label className="text-base font-semibold text-gray-700 block">
                  Tiempo Estimado
                </label>
                <div className={styles.timeDisplay}>
                  <div className={styles.timeUnit}>
                    <span className={styles.timeNumber}>
                      {timeDisplay.hours}
                    </span>
                    <span className={styles.timeLabel}>Horas</span>
                  </div>
                  <span className={styles.timeSeparator}>:</span>
                  <div className={styles.timeUnit}>
                    <span className={styles.timeNumber}>
                      {timeDisplay.minutes}
                    </span>
                    <span className={styles.timeLabel}>Minutos</span>
                  </div>
                  <span className={styles.timeSeparator}>:</span>
                  <div className={styles.timeUnit}>
                    <span className={styles.timeNumber}>
                      {timeDisplay.seconds}
                    </span>
                    <span className={styles.timeLabel}>Segundos</span>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.favoriteContainer}>
              <label className={styles.favoriteLabel}>
                <input
                  type="checkbox"
                  name="favorito"
                  checked={form.favorito}
                  onChange={handleChange}
                  className={styles.favoriteCheckbox}
                />
                <span className={styles.favoriteBox}>
                  <span className={styles.favoriteStar}>
                    {form.favorito ? "★" : "☆"}
                  </span>
                </span>
                <span className={styles.favoriteText}>
                  Marcar como ruta favorita
                </span>
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          Guardar Ruta
        </button>
      </form>

      <div className="col-span-6 h-[700px] rounded-2xl overflow-hidden border border-gray-300 shadow-lg">
        <BaseMap
          center={
            origenCoords || destinoCoords || { lat: -12.0464, lng: -77.0428 }
          }
          markers={[origenCoords, destinoCoords].filter(
            (coords): coords is { lat: number; lng: number } => coords !== null
          )}
          directions={route || undefined}
        />
      </div>
    </div>
  );
}
