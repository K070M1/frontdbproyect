"use client";

import { useEffect, useState } from "react";
import { PlacesAutocomplete } from "@/components/Map/PlaceAutcomplete";
import styles from "./ZoneForm.module.css";
import {
  FaHospital,
  FaShieldAlt,
  FaSchool,
  FaStore,
  FaTrash,
} from "react-icons/fa";

type PolygonType = "rectangle" | "circle" | "polygon";

export default function ZoneForm({
  onLocationSelected,
  onPolygonTypeChange,
  onMapReload,
}: {
  onLocationSelected?: (location: any) => void;
  onPolygonTypeChange?: (type: PolygonType | null) => void;
  onMapReload?: () => void;
}) {
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [selectedPolygon, setSelectedPolygon] = useState<PolygonType | null>(
    null
  );
  const [selectedPlace, setSelectedPlace] = useState<{
    placeId?: string;
    position?: google.maps.LatLngLiteral;
  }>({});
  const [mounted, setMounted] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceSelected = async (placeId: string) => {
    if (!window.google?.maps?.places) return;
    const placesService = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    placesService.getDetails(
      {
        placeId,
        fields: ["name", "formatted_address", "geometry"],
      },
      (place, status) => {
        if (status === "OK" && place) {
          const addressParts = (place.formatted_address || "").split(",");
          let distrito = addressParts[1]?.trim() || addressParts[0]?.trim();
          distrito = distrito.replace(/\d+/g, "").trim();
          const nombreFormateado = distrito
            ? `${place.name} - ${distrito}`
            : place.name || "";

          setForm((prev) => ({ ...prev, nombre: nombreFormateado }));

          const position = {
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0,
          };

          setSelectedPlace({ placeId, position });
          setHasLocation(true);

          if (onLocationSelected) {
            onLocationSelected({
              position,
              name: place.name,
              address: place.formatted_address,
            });
          }
        }
      }
    );
  };

  const handlePolygonSelection = (type: PolygonType) => {
    // Solo permitir selección si hay ubicación y no hay polígono seleccionado
    if (!hasLocation || selectedPolygon) return;

    setSelectedPolygon(type);
    onPolygonTypeChange?.(type);
  };

  const handleClearPolygon = () => {
    // Limpiar el polígono seleccionado
    setSelectedPolygon(null);
    onPolygonTypeChange?.(null);

    // Recargar el mapa para limpiar las figuras
    if (onMapReload) {
      onMapReload();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolygon) {
      alert("Por favor selecciona una figura para resaltar la zona segura.");
      return;
    }

    const dataToSave = {
      ...form,
      tipoPoligono: selectedPolygon,
      ubicacion: selectedPlace.position,
      placeId: selectedPlace.placeId,
    };

    console.log("Registrando zona segura:", dataToSave);
    // Aquí iría la lógica de envío al backend
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>Buscar Zona Segura</h2>

      <div className={styles.suggestions}>
        <p className={styles.suggestionsTitle}>
          Sugerencias de lugares seguros:
        </p>
        <div className={styles.suggestionsList}>
          <span className={styles.suggestionItem}>
            <FaShieldAlt /> Comisarías
          </span>
          <span className={styles.suggestionItem}>
            <FaHospital /> Hospitales
          </span>
          <span className={styles.suggestionItem}>
            <FaSchool /> Universidades
          </span>
          <span className={styles.suggestionItem}>
            <FaStore /> Centros comerciales
          </span>
        </div>
      </div>

      <div className={styles.searchSection}>
        <label>Buscar lugar seguro</label>
        <PlacesAutocomplete
          placeholder=""
          onPlaceSelected={handlePlaceSelected}
          country="pe"
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Nombre de la Zona</label>
        {mounted && (
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        )}
      </div>

      <div className={styles.inputGroup}>
        <label>Descripción</label>
        {mounted && (
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Describe por qué este lugar es seguro"
            rows={3}
            required
          />
        )}
      </div>

      <div className={styles.polygonSection}>
        <label>Resaltar zona segura</label>
        <div className={styles.polygonOptions}>
          {["rectangle", "circle", "polygon"].map((type) => (
            <button
              key={type}
              type="button"
              className={`${styles.polygonButton} ${
                selectedPolygon === type ? styles.selected : ""
              } ${selectedPolygon === type ? styles[type] : ""} ${
                !hasLocation || (selectedPolygon && selectedPolygon !== type)
                  ? styles.disabled
                  : ""
              }`}
              onClick={() => handlePolygonSelection(type as PolygonType)}
              disabled={
                !hasLocation ||
                (selectedPolygon !== null && selectedPolygon !== type)
              }
              title={
                !hasLocation
                  ? "Primero busca un lugar seguro"
                  : selectedPolygon && selectedPolygon !== type
                  ? "Ya has seleccionado una figura"
                  : `Seleccionar ${type}`
              }
            >
              <svg width="40" height="40" viewBox="0 0 40 40">
                {type === "rectangle" && (
                  <rect
                    x="8"
                    y="12"
                    width="24"
                    height="16"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                )}
                {type === "circle" && (
                  <circle
                    cx="20"
                    cy="20"
                    r="12"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                )}
                {type === "polygon" && (
                  <polygon
                    points="20,8 30,16 26,28 14,28 10,16"
                    fill="none"
                    stroke="#fb923c"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                )}
              </svg>
            </button>
          ))}

          {/* Botón de eliminar figura */}
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClearPolygon}
            disabled={!selectedPolygon}
            title="Eliminar figura del mapa"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <button type="submit" className={styles.submitButton}>
        Guardar Zona Segura
      </button>
    </form>
  );
}
