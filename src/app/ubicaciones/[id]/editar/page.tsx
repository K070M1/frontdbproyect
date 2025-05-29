"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Marker, Popup, useMapEvent } from "@/components/Map/MapShell";
import { LatLngTuple } from "leaflet";

import LayoutShell from "@/components/Layout/LayoutShell";
import BaseMap from "@/components/Map/BaseMap";
import { useMapIcons } from "@/utils/useMapIcons";

import { mockUbicaciones } from "@/data/mockUbicaciones";

import styles from "./page.module.css";
import "leaflet/dist/leaflet.css";

export default function EditarUbicacionPage() {
  const { id } = useParams();
  const router = useRouter();
  // const mapRef = useRef<LeafletMap | null>(null);
  const icons = useMapIcons();

  const ubicacion = mockUbicaciones.find((u) => u.id.toString() === id);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    latitud: 0,
    longitud: 0,
  });

  useEffect(() => {
    if (ubicacion) {
      setForm({
        nombre: ubicacion.nombre,
        descripcion: ubicacion.descripcion,
        latitud: ubicacion.latitud,
        longitud: ubicacion.longitud,
      });
    }
  }, [ubicacion]);

  // Hook para manejar clicks en el mapa
  function MapClickHandler() {
    useMapEvent("click", (event) => {
      const { lat, lng } = event.latlng;
      setForm((prev) => ({ ...prev, latitud: lat, longitud: lng }));
    });
    return null;
  }

  if (!ubicacion) {
    return (
      <LayoutShell>
        <h1>Ubicación no encontrada</h1>
      </LayoutShell>
    );
  }

  if (!icons.MARKER) {
    return (
      <LayoutShell>
        <h1>Cargando mapa...</h1>
      </LayoutShell>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "latitud" || name === "longitud" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Guardando cambios:", form);
    router.push("/ubicaciones");
  };

  const center: LatLngTuple = [form.latitud, form.longitud];

  return (
    <LayoutShell>
      <h1 className={styles.title}>Editar Ubicación: {form.nombre}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Nombre</label>
        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />

        <label>Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required />

        <label>Latitud</label>
        <input type="number" name="latitud" step="0.000001" value={form.latitud} onChange={handleChange} required />

        <label>Longitud</label>
        <input type="number" name="longitud" step="0.000001" value={form.longitud} onChange={handleChange} required />

        <div className={styles.mapContainer}>
          <BaseMap center={center} zoom={15}>
            <MapClickHandler />
            <Marker position={center} icon={icons.MARKER}>
              <Popup>
                <strong>{form.nombre}</strong>
                <br />
                {form.descripcion}
              </Popup>
            </Marker>
          </BaseMap>
        </div>

        <button type="submit" className={styles.submitButton}>
          Guardar Cambios
        </button>
      </form>
    </LayoutShell>
  );
}
