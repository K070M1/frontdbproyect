"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import ZoneForm from "@/components/Zones/ZoneForm";
import DrawableMap from "@/components/Map/DrawableMap";
import { useGetZones } from '@/services/querys/zone.query';
import styles from "./page.module.css";

export default function NuevaZonaSeguraPage() {
  const [mapCenter, setMapCenter] = useState({ lat: -12.0464, lng: -77.0428 });
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [polygonType, setPolygonType] = useState<"rectangle" | "circle" | "polygon" | null>(null);
  const [mapKey, setMapKey] = useState(0); // Key para forzar recarga del mapa
  const [drawnShape, setDrawnShape] = useState<any>(null);
  const [drawnShapeType, setDrawnShapeType] = useState<"rectangle" | "circle" | "polygon" | null>(null);
  const [isUnsafeZone, setIsUnsafeZone] = useState(false); // Estado para saber si es zona insegura

  const { data: zones, isLoading: loadingZones } = useGetZones();

  const handleLocationSelected = (location: any) => {
    setSelectedLocation(location);
    if (location?.position) setMapCenter(location.position);
  };

  const handlePolygonTypeChange = (type: typeof polygonType) => {
    setPolygonType(type);
  };

  const handleDrawingModeChange = (mode: typeof polygonType) => {
    console.log("Page: Modo de dibujo cambiado a:", mode);
    setPolygonType(mode);
  };

  const handleShapeDrawn = (shape: any, type: typeof polygonType) => {
    console.log("Page: Forma dibujada:", type, shape);
    setDrawnShape(shape);
    setDrawnShapeType(type); // Guardar el tipo de forma dibujada
    setPolygonType(null); // Resetear el modo de dibujo
    
    // Extraer el centro de la forma dibujada para centrar el mapa
    let center;
    if (type === "circle") {
      center = {
        lat: shape.getCenter().lat(),
        lng: shape.getCenter().lng(),
      };
    } else if (type === "rectangle") {
      const bounds = shape.getBounds();
      center = {
        lat: bounds.getCenter().lat(),
        lng: bounds.getCenter().lng(),
      };
    } else if (type === "polygon") {
      const bounds = new google.maps.LatLngBounds();
      shape.getPath().forEach((point: any) => bounds.extend(point));
      center = {
        lat: bounds.getCenter().lat(),
        lng: bounds.getCenter().lng(),
      };
    }

    if (center) {
      setMapCenter(center);
      setSelectedLocation({ position: center, shape, type });
    }
  };

  const handleMapReload = () => {
    // Incrementar la key para forzar la recarga del mapa
    setMapKey((prev) => prev + 1);
    // Limpiar estados
    setPolygonType(null);
    setDrawnShape(null);
    setDrawnShapeType(null);
    setSelectedLocation(null);
  };

  const handleFormStateChange = (formState: { inseguro: boolean }) => {
    setIsUnsafeZone(formState.inseguro);
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
    <div className={styles.container}>
      <h1 className={styles.title}>Registrar Nueva Zona</h1>
      <div className={styles.layoutWrapper}>
        <div className={styles.formContainer}>
          <ZoneForm
            onLocationSelected={handleLocationSelected}
            onPolygonTypeChange={handlePolygonTypeChange}
            onMapReload={handleMapReload}
            onDrawingModeChange={handleDrawingModeChange}
            onFormStateChange={handleFormStateChange}
            drawnShape={drawnShape}
            polygonType={polygonType}
            drawnShapeType={drawnShapeType}
          />
        </div>
        <div className={styles.mapContainer}>
          <h3 className={styles.mapTitle}>Mapa Interactivo</h3>
          <p className={styles.mapInstructions}>
            {polygonType 
              ? `Modo de dibujo activo: ${polygonType}. Haz clic en el mapa para dibujar.`
              : "Selecciona un tipo de figura en el formulario para comenzar a dibujar."
            }
            {!loadingZones && zones && zones.length > 0 && (
              <span className={styles.existingZonesInfo}>
                <br />Las zonas existentes se muestran según su tipo en el mapa ({zones.length} zona{zones.length !== 1 ? 's' : ''}): 🟢 seguras, 🔴 inseguras.
              </span>
            )}
            {loadingZones && (
              <span className={styles.loadingZonesInfo}>
                <br />Cargando zonas existentes...
              </span>
            )}
          </p>
          <DrawableMap
            key={mapKey}
            drawingMode={polygonType}
            onShapeDrawn={handleShapeDrawn}
            onMapReload={mapKey > 0}
            existingZones={!loadingZones ? zones : []}
            isUnsafeZone={isUnsafeZone}
            isNewZone={true}
          />
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
