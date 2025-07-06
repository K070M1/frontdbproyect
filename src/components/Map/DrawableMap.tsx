"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GoogleMap, LoadScript, DrawingManager } from "@react-google-maps/api";

const libraries: ("drawing" | "places")[] = ["drawing", "places"];

type PolygonType = "rectangle" | "circle" | "polygon";

interface DrawableMapProps {
  onShapeDrawn?: (shape: any, type: PolygonType) => void;
  drawingMode?: PolygonType | null;
  onMapReload?: boolean;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: -12.0464, // Lima, Perú
  lng: -77.0428,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

export default function DrawableMap({
  onShapeDrawn,
  drawingMode,
  onMapReload,
}: DrawableMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const [drawnShapes, setDrawnShapes] = useState<any[]>([]);
  const drawnShapesRef = useRef<any[]>([]);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Limpiar formas cuando se recarga el mapa
  useEffect(() => {
    if (onMapReload) {
      drawnShapesRef.current.forEach((shape) => {
        if (shape.setMap) {
          shape.setMap(null);
        }
      });
      drawnShapesRef.current = [];
      setDrawnShapes([]);
    }
  }, [onMapReload]); // Removido drawnShapes de las dependencias para evitar bucle

  // Cambiar modo de dibujo
  useEffect(() => {
    if (drawingManagerRef.current && isScriptLoaded && window.google?.maps?.drawing) {
      let drawingMode_: google.maps.drawing.OverlayType | null = null;
      
      switch (drawingMode) {
        case "rectangle":
          drawingMode_ = google.maps.drawing.OverlayType.RECTANGLE;
          break;
        case "circle":
          drawingMode_ = google.maps.drawing.OverlayType.CIRCLE;
          break;
        case "polygon":
          drawingMode_ = google.maps.drawing.OverlayType.POLYGON;
          break;
        default:
          drawingMode_ = null;
      }

      console.log("Setting drawing mode:", drawingMode_, "from:", drawingMode);
      drawingManagerRef.current.setDrawingMode(drawingMode_);
    }
  }, [drawingMode, isScriptLoaded]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    console.log("Map loaded successfully");
  }, []);

  const onDrawingManagerLoad = useCallback((drawingManager: google.maps.drawing.DrawingManager) => {
    drawingManagerRef.current = drawingManager;
    console.log("DrawingManager loaded successfully");
    
    // Asegurar que el drawing manager esté configurado correctamente
    if (mapRef.current) {
      drawingManager.setMap(mapRef.current);
    }
  }, []);

  const handleOverlayComplete = useCallback((event: google.maps.drawing.OverlayCompleteEvent) => {
    const { type, overlay } = event;
    
    console.log("Overlay completed:", type, overlay);
    
    // Limpiar formas anteriores
    drawnShapesRef.current.forEach((shape) => {
      if (shape.setMap) {
        shape.setMap(null);
      }
    });

    // Guardar la nueva forma
    drawnShapesRef.current = [overlay];
    setDrawnShapes([overlay]);

    // Determinar el tipo de forma
    let shapeType: PolygonType;
    switch (type) {
      case google.maps.drawing.OverlayType.RECTANGLE:
        shapeType = "rectangle";
        break;
      case google.maps.drawing.OverlayType.CIRCLE:
        shapeType = "circle";
        break;
      case google.maps.drawing.OverlayType.POLYGON:
        shapeType = "polygon";
        break;
      default:
        console.log("Tipo de forma no reconocido:", type);
        return;
    }

    // Notificar al padre sobre la forma dibujada
    if (onShapeDrawn) {
      onShapeDrawn(overlay, shapeType);
    }

    // Desactivar el modo de dibujo después de completar una forma
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
  }, [onShapeDrawn]);

  const onScriptLoad = useCallback(() => {
    setIsScriptLoaded(true);
    console.log("Google Maps script loaded");
  }, []);

  const drawingManagerOptions = {
    drawingControl: false,
    drawingMode: null,
    rectangleOptions: {
      fillColor: "#10b981",
      fillOpacity: 0.3,
      strokeWeight: 2,
      strokeColor: "#059669",
      clickable: true,
      editable: true,
      draggable: true,
    },
    circleOptions: {
      fillColor: "#3b82f6",
      fillOpacity: 0.3,
      strokeWeight: 2,
      strokeColor: "#1d4ed8",
      clickable: true,
      editable: true,
      draggable: true,
    },
    polygonOptions: {
      fillColor: "#f59e0b",
      fillOpacity: 0.3,
      strokeWeight: 2,
      strokeColor: "#d97706",
      clickable: true,
      editable: true,
      draggable: true,
    },
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return (
      <div style={{ 
        width: "100%", 
        height: "400px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        border: "1px solid #ddd"
      }}>
        <p>Error: Google Maps API key no configurada</p>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={apiKey} 
      libraries={libraries}
      onLoad={onScriptLoad}
      loadingElement={
        <div style={{ 
          width: "100%", 
          height: "400px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px"
        }}>
          Cargando mapa...
        </div>
      }
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        options={mapOptions}
      >
        {isScriptLoaded && (
          <DrawingManager
            onLoad={onDrawingManagerLoad}
            onOverlayComplete={handleOverlayComplete}
            options={drawingManagerOptions}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
