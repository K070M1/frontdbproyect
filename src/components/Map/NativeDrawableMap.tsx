"use client";

import { useEffect, useRef, useState } from "react";

type PolygonType = "rectangle" | "circle" | "polygon";

interface NativeDrawableMapProps {
  onShapeDrawn?: (shape: any, type: PolygonType) => void;
  drawingMode?: PolygonType | null;
  onMapReload?: boolean;
}

export default function NativeDrawableMap({
  onShapeDrawn,
  drawingMode,
  onMapReload,
}: NativeDrawableMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const [drawnShapes, setDrawnShapes] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google?.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=drawing,places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google?.maps) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: -12.0464, lng: -77.0428 }, // Lima, Perú
      zoom: 12,
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    googleMapRef.current = map;

    // Inicializar Drawing Manager
    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
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
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;

    // Manejar eventos de dibujo completado
    google.maps.event.addListener(drawingManager, "overlaycomplete", (event: any) => {
      console.log("Overlay completed:", event.type, event.overlay);
      
      // Limpiar formas anteriores
      drawnShapes.forEach((shape) => {
        if (shape.setMap) {
          shape.setMap(null);
        }
      });

      // Guardar la nueva forma
      const newShape = event.overlay;
      setDrawnShapes([newShape]);

      // Determinar el tipo de forma
      let shapeType: PolygonType;
      switch (event.type) {
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
          console.log("Tipo de forma no reconocido:", event.type);
          return;
      }

      // Notificar al padre sobre la forma dibujada
      if (onShapeDrawn) {
        onShapeDrawn(newShape, shapeType);
      }

      // Desactivar el modo de dibujo después de completar una forma
      drawingManager.setDrawingMode(null);
    });

    setIsLoaded(true);
  };

  // Limpiar formas cuando se recarga el mapa
  useEffect(() => {
    if (onMapReload) {
      drawnShapes.forEach((shape) => {
        if (shape.setMap) {
          shape.setMap(null);
        }
      });
      setDrawnShapes([]);
    }
  }, [onMapReload, drawnShapes]);

  // Cambiar modo de dibujo
  useEffect(() => {
    if (drawingManagerRef.current && isLoaded) {
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
  }, [drawingMode, isLoaded]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    />
  );
}
