"use client";

import { useState } from "react";
import ZoneForm from "@/components/Zones/ZoneForm";
import DrawableMap from "@/components/Map/DrawableMap";
import NativeDrawableMap from "@/components/Map/NativeDrawableMap";
import styles from "./ZoneCreator.module.css";

type PolygonType = "rectangle" | "circle" | "polygon";

export default function ZoneCreator() {
  const [selectedPolygonType, setSelectedPolygonType] = useState<PolygonType | null>(null);
  const [mapReloadKey, setMapReloadKey] = useState(0);
  const [drawnShape, setDrawnShape] = useState<any>(null);
  const [useNativeMap, setUseNativeMap] = useState(true); // Por defecto usar la versión nativa

  const handlePolygonTypeChange = (type: PolygonType | null) => {
    setSelectedPolygonType(type);
  };

  const handleDrawingModeChange = (mode: PolygonType | null) => {
    setSelectedPolygonType(mode);
  };

  const handleMapReload = () => {
    setMapReloadKey(prev => prev + 1);
    setDrawnShape(null);
  };

  const handleShapeDrawn = (shape: any, type: PolygonType) => {
    setDrawnShape(shape);
    // Opcional: resetear el modo de dibujo después de dibujar
    setSelectedPolygonType(null);
  };

  const handleLocationSelected = (location: any) => {
    console.log("Ubicación seleccionada:", location);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <ZoneForm
          onLocationSelected={handleLocationSelected}
          onPolygonTypeChange={handlePolygonTypeChange}
          onMapReload={handleMapReload}
          onDrawingModeChange={handleDrawingModeChange}
        />
      </div>
      
      <div className={styles.mapSection}>
        <div className={styles.mapControls}>
          <h3 className={styles.mapTitle}>Mapa Interactivo</h3>
          <button
            type="button"
            onClick={() => setUseNativeMap(!useNativeMap)}
            className={styles.toggleButton}
          >
            Cambiar a {useNativeMap ? "React Maps" : "Mapa Nativo"}
          </button>
        </div>
        <p className={styles.mapInstructions}>
          {selectedPolygonType 
            ? `Modo de dibujo activo: ${selectedPolygonType}. Haz clic en el mapa para dibujar.`
            : "Selecciona un tipo de figura en el formulario para comenzar a dibujar."
          }
        </p>
        {useNativeMap ? (
          <NativeDrawableMap
            key={mapReloadKey}
            drawingMode={selectedPolygonType}
            onShapeDrawn={handleShapeDrawn}
            onMapReload={mapReloadKey > 0}
          />
        ) : (
          <DrawableMap
            key={mapReloadKey}
            drawingMode={selectedPolygonType}
            onShapeDrawn={handleShapeDrawn}
            onMapReload={mapReloadKey > 0}
          />
        )}
      </div>
    </div>
  );
}
