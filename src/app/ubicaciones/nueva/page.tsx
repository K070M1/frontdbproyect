"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Marker, Popup, useMapEvent } from "@/components/Map/MapShell";
import { LatLngTuple } from "leaflet";

import LayoutShell from "@/components/Layout/LayoutShell";
import BaseMap from "@/components/Map/BaseMap";
import { useMapIcons } from "@/utils/useMapIcons";

import styles from "./page.module.css";
import "leaflet/dist/leaflet.css";

export default function NuevaUbicacionPage() {
  const router = useRouter();
  const { MARKER } = useMapIcons();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    latitud: -12.0464,
    longitud: -77.0428,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "latitud" || name === "longitud" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registrando ubicación:", form);
    router.push("/ubicaciones");
  };

  const center: LatLngTuple = [form.latitud, form.longitud];

  function MapClickHandler() {
    useMapEvent("click", (event) => {
      const { lat, lng } = event.latlng;
      setForm((prev) => ({ ...prev, latitud: lat, longitud: lng }));
    });
    return null;
  }

  return (
    <LayoutShell>
      <h1 className={styles.title}>Agregar Nueva Ubicación</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Nombre</label>
        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />

        <label>Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required />

        <label>Latitud</label>
        <input type="number" name="latitud" step="0.000001" value={form.latitud} onChange={handleChange} required />

        <label>Longitud</label>
        <input type="number" name="longitud" step="0.000001" value={form.longitud} onChange={handleChange} required />

        <div className={styles.mapWrapper}>
          <BaseMap center={center} zoom={15}>
            <MapClickHandler />
            <Marker position={center} icon={MARKER}>
              <Popup>
                <strong>{form.nombre || "Nueva Ubicación"}</strong>
                <br />
                {form.descripcion || "Descripción pendiente"}
              </Popup>
            </Marker>
          </BaseMap>
        </div>

        <button type="submit" className={styles.submitButton}>
          Guardar
        </button>
      </form>
    </LayoutShell>
  );
}
