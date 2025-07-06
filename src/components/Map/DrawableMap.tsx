"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GoogleMap, DrawingManager, Polygon, Circle, Rectangle, useJsApiLoader } from "@react-google-maps/api";

const libraries: ("drawing" | "places")[] = ["drawing", "places"];

type PolygonType = "rectangle" | "circle" | "polygon";

interface Zone {
  id_zona: number;
  nombre: string;
  descripcion: string;
  forma: string;
  geojson: string;
  area_m2: number;
  perimeter_m: number;
  created_at: string;
  updated_at: string;
}

interface DrawableMapProps {
  onShapeDrawn?: (shape: any, type: PolygonType) => void;
  drawingMode?: PolygonType | null;
  onMapReload?: boolean;
  existingZones?: Zone[];
  currentZone?: Zone; // Zona que se está editando actualmente
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
  existingZones = [],
  currentZone,
}: DrawableMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const [drawnShapes, setDrawnShapes] = useState<any[]>([]);
  const drawnShapesRef = useRef<any[]>([]);
  const [processedZones, setProcessedZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  // Usar useJsApiLoader en lugar de LoadScript para evitar problemas de carga múltiple
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries
  });

  // Función para procesar las zonas existentes
  const processExistingZones = useCallback(() => {
    if (!existingZones || existingZones.length === 0) {
      setProcessedZones([]);
      return;
    }

    const processed = existingZones.map((zone) => {
      try {
        const geoJson = JSON.parse(zone.geojson);
        return {
          ...zone,
          coordinates: geoJson.coordinates,
          geometryType: geoJson.type,
        };
      } catch (error) {
        console.error(`Error parsing GeoJSON for zone ${zone.id_zona}:`, error);
        return null;
      }
    }).filter(Boolean);

    setProcessedZones(processed);
  }, [existingZones]);

  // Procesar zonas cuando cambien
  useEffect(() => {
    processExistingZones();
  }, [processExistingZones]);

  // Limpiar formas dibujadas por el usuario cuando se recarga el mapa
  useEffect(() => {
    if (onMapReload) {
      // Solo limpiar las formas dibujadas por el usuario, no las zonas existentes
      drawnShapesRef.current.forEach((shape) => {
        if (shape.setMap) {
          shape.setMap(null);
        }
      });
      drawnShapesRef.current = [];
      setDrawnShapes([]);
    }
  }, [onMapReload]);

  // Cambiar modo de dibujo
  useEffect(() => {
    if (drawingManagerRef.current && isLoaded && window.google?.maps?.drawing) {
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
    
    // Limpiar SOLO las formas dibujadas por el usuario (no las zonas existentes)
    drawnShapesRef.current.forEach((shape) => {
      if (shape.setMap) {
        shape.setMap(null);
      }
    });

    // Guardar la nueva forma dibujada por el usuario
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

  // Función para renderizar zonas existentes
  const renderExistingZones = () => {
    return processedZones.map((zone, index) => {
      const key = `zone-${zone.id_zona}-${index}`;
      const isCurrentZone = currentZone && currentZone.id_zona === zone.id_zona;
      
      // Colores diferentes para la zona actual vs otras zonas
      const colors = isCurrentZone 
        ? {
            fillColor: "#3b82f6", // Azul para la zona que se está editando
            strokeColor: "#1d4ed8",
            fillOpacity: 0.15, // Más transparente para permitir dibujo encima
            strokeOpacity: 0.6,
            strokeWeight: 2,
          }
        : {
            fillColor: "#ef4444", // Rojo para las demás zonas
            strokeColor: "#dc2626",
            fillOpacity: 0.2,
            strokeOpacity: 0.8,
            strokeWeight: 2,
          };
      
      try {
        if (zone.geometryType === 'Polygon' && zone.coordinates && zone.coordinates[0]) {
          const paths = zone.coordinates[0].map((coord: number[]) => ({
            lat: coord[1],
            lng: coord[0]
          }));

          return (
            <Polygon
              key={key}
              paths={paths}
              options={{
                fillColor: colors.fillColor,
                fillOpacity: colors.fillOpacity,
                strokeColor: colors.strokeColor,
                strokeOpacity: colors.strokeOpacity,
                strokeWeight: colors.strokeWeight,
                clickable: !isCurrentZone, // La zona actual no es clickable para permitir dibujo
                zIndex: isCurrentZone ? 1 : 10, // Zona actual debajo para permitir dibujo encima
              }}
              onClick={() => {
                if (!isCurrentZone) {
                  setSelectedZone(zone);
                  console.log(`Zona seleccionada: ${zone.nombre}`, zone);
                }
              }}
            />
          );
        } else if (zone.geometryType === 'MultiPolygon' && zone.coordinates) {
          // Manejar MultiPolygon
          return zone.coordinates.map((polygon: number[][][], polygonIndex: number) => {
            const paths = polygon[0].map((coord: number[]) => ({
              lat: coord[1],
              lng: coord[0]
            }));

            return (
              <Polygon
                key={`${key}-${polygonIndex}`}
                paths={paths}
                options={{
                  fillColor: colors.fillColor,
                  fillOpacity: colors.fillOpacity,
                  strokeColor: colors.strokeColor,
                  strokeOpacity: colors.strokeOpacity,
                  strokeWeight: colors.strokeWeight,
                  clickable: !isCurrentZone,
                  zIndex: isCurrentZone ? 1 : 10,
                }}
                onClick={() => {
                  if (!isCurrentZone) {
                    setSelectedZone(zone);
                    console.log(`Zona seleccionada: ${zone.nombre}`, zone);
                  }
                }}
              />
            );
          });
        } else if (zone.geometryType === 'Point' && zone.coordinates) {
          // Para puntos, crear un círculo pequeño
          const center = {
            lat: zone.coordinates[1],
            lng: zone.coordinates[0]
          };

          return (
            <Circle
              key={key}
              center={center}
              radius={50} // Radio pequeño para puntos
              options={{
                fillColor: colors.fillColor,
                fillOpacity: colors.fillOpacity,
                strokeColor: colors.strokeColor,
                strokeOpacity: colors.strokeOpacity,
                strokeWeight: colors.strokeWeight,
                clickable: !isCurrentZone,
                zIndex: isCurrentZone ? 1 : 10,
              }}
              onClick={() => {
                if (!isCurrentZone) {
                  setSelectedZone(zone);
                  console.log(`Zona seleccionada: ${zone.nombre}`, zone);
                }
              }}
            />
          );
        }
      } catch (error) {
        console.error(`Error rendering zone ${zone.id_zona}:`, error);
      }
      
      return null;
    }).flat().filter(Boolean);
  };

  const drawingManagerOptions = {
    drawingControl: false,
    drawingMode: null,
    rectangleOptions: {
      fillColor: "#10b981",
      fillOpacity: 0.4,
      strokeWeight: 3,
      strokeColor: "#059669",
      clickable: true,
      editable: true,
      draggable: true,
      zIndex: 100, // Alto z-index para aparecer encima de las zonas existentes
    },
    circleOptions: {
      fillColor: "#3b82f6",
      fillOpacity: 0.4,
      strokeWeight: 3,
      strokeColor: "#1d4ed8",
      clickable: true,
      editable: true,
      draggable: true,
      zIndex: 100,
    },
    polygonOptions: {
      fillColor: "#f59e0b",
      fillOpacity: 0.4,
      strokeWeight: 3,
      strokeColor: "#d97706",
      clickable: true,
      editable: true,
      draggable: true,
      zIndex: 100,
    },
  };

  // Manejo de errores de carga
  if (loadError) {
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
        <p>Error al cargar Google Maps</p>
      </div>
    );
  }

  // Mostrar indicador de carga
  if (!isLoaded) {
    return (
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
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        options={mapOptions}
        onClick={() => setSelectedZone(null)} // Limpiar selección al hacer clic en el mapa
      >
        {/* Renderizar zonas existentes */}
        {renderExistingZones()}
        
        {/* Drawing Manager para nuevas formas */}
        <DrawingManager
          onLoad={onDrawingManagerLoad}
          onOverlayComplete={handleOverlayComplete}
          options={drawingManagerOptions}
        />
      </GoogleMap>
      
      {/* Información de zona seleccionada */}
      {selectedZone && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'white',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          maxWidth: '250px',
          zIndex: 1000
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
              {currentZone && currentZone.id_zona === selectedZone.id_zona 
                ? 'Zona Actual (Editando)' 
                : 'Zona Existente'
              }
            </h4>
            <button
              onClick={() => setSelectedZone(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '0',
                color: '#6b7280'
              }}
            >
              ×
            </button>
          </div>
          <p style={{ margin: '4px 0', fontSize: '12px' }}>
            <strong>Nombre:</strong> {selectedZone.nombre}
          </p>
          <p style={{ margin: '4px 0', fontSize: '12px' }}>
            <strong>Descripción:</strong> {selectedZone.descripcion}
          </p>
          <p style={{ margin: '4px 0', fontSize: '12px' }}>
            <strong>Área:</strong> {Math.round(selectedZone.area_m2)} m²
          </p>
          <p style={{ margin: '4px 0', fontSize: '12px' }}>
            <strong>Forma:</strong> {selectedZone.forma}
          </p>
          {currentZone && currentZone.id_zona === selectedZone.id_zona && (
            <p style={{ 
              margin: '8px 0 4px 0', 
              fontSize: '11px', 
              color: '#3b82f6',
              fontStyle: 'italic'
            }}>
              💡 Selecciona un tipo de figura para modificar esta zona
            </p>
          )}
        </div>
      )}
    </div>
  );
}
