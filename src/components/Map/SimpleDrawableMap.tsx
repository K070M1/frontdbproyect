"use client";

import { useEffect, useRef } from "react";

interface SimpleDrawableMapProps {
  drawingMode?: string | null;
  onShapeDrawn?: (shape: any, type: string) => void;
}

export default function SimpleDrawableMap({ 
  drawingMode, 
  onShapeDrawn 
}: SimpleDrawableMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);

  useEffect(() => {
    initMap();
  }, []);

  useEffect(() => {
    if (drawingManagerRef.current) {
      updateDrawingMode();
    }
  }, [drawingMode]);

  const initMap = () => {
    // Check if Google Maps API is loaded
    if (!window.google?.maps) {
      // Load Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=drawing&callback=initMapCallback`;
      script.async = true;
      script.defer = true;
      
      // Define callback globally
      (window as any).initMapCallback = () => {
        createMap();
      };
      
      document.head.appendChild(script);
    } else {
      createMap();
    }
  };

  const createMap = () => {
    if (!mapRef.current) return;

    console.log("Creando mapa...");

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: -12.0464, lng: -77.0428 },
      zoom: 12,
    });

    mapInstanceRef.current = map;

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
      rectangleOptions: {
        fillColor: '#ff0000',
        fillOpacity: 0.3,
        strokeColor: '#ff0000',
        strokeWeight: 2,
        clickable: true,
        editable: true,
      },
      circleOptions: {
        fillColor: '#0000ff',
        fillOpacity: 0.3,
        strokeColor: '#0000ff',
        strokeWeight: 2,
        clickable: true,
        editable: true,
      },
      polygonOptions: {
        fillColor: '#00ff00',
        fillOpacity: 0.3,
        strokeColor: '#00ff00',
        strokeWeight: 2,
        clickable: true,
        editable: true,
      },
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;

    google.maps.event.addListener(drawingManager, 'overlaycomplete', (event: any) => {
      console.log('Forma dibujada:', event.type);
      
      if (onShapeDrawn) {
        onShapeDrawn(event.overlay, event.type);
      }
      
      // Desactivar modo de dibujo
      drawingManager.setDrawingMode(null);
    });

    console.log("Mapa y DrawingManager inicializados");
  };

  const updateDrawingMode = () => {
    if (!drawingManagerRef.current) return;

    let mode = null;
    switch (drawingMode) {
      case 'rectangle':
        mode = google.maps.drawing.OverlayType.RECTANGLE;
        break;
      case 'circle':
        mode = google.maps.drawing.OverlayType.CIRCLE;
        break;
      case 'polygon':
        mode = google.maps.drawing.OverlayType.POLYGON;
        break;
    }

    console.log('Cambiando modo de dibujo a:', mode);
    drawingManagerRef.current.setDrawingMode(mode);
  };

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '400px',
        border: '1px solid #ccc',
        borderRadius: '8px'
      }} 
    />
  );
}
