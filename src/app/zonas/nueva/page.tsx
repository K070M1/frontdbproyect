"use client";

import { useState } from "react";
import LayoutShell from "@/components/Layout/LayoutShell";
import ZoneForm from "@/components/Zones/ZoneForm";
import GoogleBaseMap from "@/components/Map/BaseMap";
import { Circle, Polygon, Rectangle } from "@react-google-maps/api";
import styles from "./page.module.css";

export default function NuevaZonaSeguraPage() {
  const [mapCenter, setMapCenter] = useState({ lat: -12.0464, lng: -77.0428 });
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [polygonType, setPolygonType] = useState<
    "rectangle" | "circle" | "polygon" | null
  >(null);
  const [mapKey, setMapKey] = useState(0); // Key para forzar recarga del mapa

  const handleLocationSelected = (location: any) => {
    setSelectedLocation(location);
    if (location?.position) setMapCenter(location.position);
  };

  const handlePolygonTypeChange = (type: typeof polygonType) => {
    setPolygonType(type);
  };

  const handleMapReload = () => {
    // Incrementar la key para forzar la recarga del mapa
    setMapKey((prev) => prev + 1);
    // También limpiar el tipo de polígono
    setPolygonType(null);
  };

  const renderZoneShape = () => {
    if (!selectedLocation?.position || !polygonType) return null;
    const center = selectedLocation.position;

    const colors: Record<string, string> = {
      rectangle: "#10b981",
      circle: "#60a5fa",
      polygon: "#fb923c",
    };

    const options = {
      fillColor: colors[polygonType],
      fillOpacity: 0.3,
      strokeColor: colors[polygonType],
      strokeOpacity: 0.8,
      strokeWeight: 2,
    };

    switch (polygonType) {
      case "circle":
        return (
          <Circle
            key="circle-shape"
            center={center}
            radius={200}
            options={options}
          />
        );
      case "rectangle":
        const bounds = {
          north: center.lat + 0.002,
          south: center.lat - 0.002,
          east: center.lng + 0.002,
          west: center.lng - 0.002,
        };
        return (
          <Rectangle key="rectangle-shape" bounds={bounds} options={options} />
        );
      case "polygon":
        const paths = [
          { lat: center.lat + 0.002, lng: center.lng },
          { lat: center.lat + 0.001, lng: center.lng + 0.002 },
          { lat: center.lat - 0.001, lng: center.lng + 0.002 },
          { lat: center.lat - 0.002, lng: center.lng },
          { lat: center.lat - 0.001, lng: center.lng - 0.002 },
          { lat: center.lat + 0.001, lng: center.lng - 0.002 },
        ];
        return <Polygon key="polygon-shape" paths={paths} options={options} />;
    }

    return null;
  };

  return (
    <LayoutShell>
      <h1 className={styles.title}>Registrar Nueva Zona Segura</h1>
      <div className={styles.layoutWrapper}>
        <div className={styles.formContainer}>
          <ZoneForm
            onLocationSelected={handleLocationSelected}
            onPolygonTypeChange={handlePolygonTypeChange}
            onMapReload={handleMapReload}
          />
        </div>
        <div className={styles.mapContainer}>
          <GoogleBaseMap
            key={mapKey} // Esto forzará la recarga del mapa cuando cambie
            center={mapCenter}
            zoom={16}
            markers={selectedLocation ? [selectedLocation.position] : []}
          >
            {renderZoneShape()}
          </GoogleBaseMap>
        </div>
      </div>
    </LayoutShell>
  );
}
