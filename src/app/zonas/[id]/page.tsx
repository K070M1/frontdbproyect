"use client";
import { useState, useEffect } from 'react'
import { useParams } from "next/navigation";
import ZoneForm from "@/components/Zones/ZoneForm";
import DrawableMap from "@/components/Map/DrawableMap";
import { useGetZone, useGetZones } from "@/services/querys/zone.query";
import { useSelectableList } from '@/hooks/useList';
import styles from "./page.module.css";

export default function ZonaSeguraDetallePage() {
  const { id } = useParams();
  const { mutateAsync: getZone, isPending } = useGetZone();
  const { data: zones, isLoading: loadingZones } = useGetZones();
  const [zona, setZona] = useState<any>(null);
  
  // Estados para el mapa y formulario (igual que en nueva zona)
  const [mapCenter, setMapCenter] = useState({ lat: -12.0464, lng: -77.0428 });
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [polygonType, setPolygonType] = useState<"rectangle" | "circle" | "polygon" | null>(null);
  const [mapKey, setMapKey] = useState(0);
  const [drawnShape, setDrawnShape] = useState<any>(null);
  const [drawnShapeType, setDrawnShapeType] = useState<"rectangle" | "circle" | "polygon" | null>(null);

  const listZones = useSelectableList(zones);

  const searchZone = async (id: any) => {
    const res = await getZone(id);
    if (res && res.length > 0) {
      const zoneData = res[0];
      setZona(zoneData);
      
      // Centrar el mapa en la zona existente si es posible
      if (zoneData.geojson) {
        try {
          const geoJson = JSON.parse(zoneData.geojson);
          if (geoJson.type === 'Polygon' && geoJson.coordinates && geoJson.coordinates[0]) {
            // Calcular el centro del polígono
            const coords = geoJson.coordinates[0];
            const lat = coords.reduce((sum: number, coord: number[]) => sum + coord[1], 0) / coords.length;
            const lng = coords.reduce((sum: number, coord: number[]) => sum + coord[0], 0) / coords.length;
            setMapCenter({ lat, lng });
          }
        } catch (error) {
          console.error('Error parsing geojson:', error);
        }
      }
    } else {
      setZona(null);
    }
  };

  useEffect(() => {
    if (id) {
      searchZone(id);
    }
  }, [id]);

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
    setDrawnShapeType(type);
    setPolygonType(null);
    
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
    setMapKey((prev) => prev + 1);
    setPolygonType(null);
    setDrawnShape(null);
    setDrawnShapeType(null);
    setSelectedLocation(null);
  };

  if (isPending) {
    return (
      <div className={styles.container}>
        <h1>Cargando zona...</h1>
      </div>
    );
  }

  if (!zona) {
    return (
      <div className={styles.container}>
        <h1>Zona no encontrada</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Editar Zona Segura: {zona.nombre}</h1>
      <div className={styles.layoutWrapper}>
        <div className={styles.formContainer}>
          <ZoneForm
            onLocationSelected={handleLocationSelected}
            onPolygonTypeChange={handlePolygonTypeChange}
            onMapReload={handleMapReload}
            onDrawingModeChange={handleDrawingModeChange}
            drawnShape={drawnShape}
            polygonType={polygonType}
            drawnShapeType={drawnShapeType}
            editMode={true}
            initialData={zona}
            zoneId={Array.isArray(id) ? id[0] : id}
          />
        </div>
        <div className={styles.mapContainer}>
          <h3 className={styles.mapTitle}>Mapa Interactivo</h3>
          <p className={styles.mapInstructions}>
            {polygonType 
              ? `Modo de dibujo activo: ${polygonType}. Haz clic en el mapa para dibujar una nueva forma.`
              : "Zona actual mostrada en el mapa. Selecciona un tipo de figura para modificar la forma."
            }
            {!loadingZones && zones && zones.length > 0 && (
              <span className={styles.existingZonesInfo}>
                <br />Zona actual mostrada en azul. Las demás zonas en rojo ({zones.length - 1} zona{zones.length !== 2 ? 's' : ''} adicional{zones.length !== 2 ? 'es' : ''}).
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
            currentZone={zona}
          />
        </div>
      </div>
    </div>
  );
}
