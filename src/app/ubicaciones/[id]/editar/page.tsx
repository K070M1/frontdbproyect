"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import LayoutShell from "@/components/Layout/LayoutShell";
import { mockUbicaciones } from "@/data/mockUbicaciones";
import dynamic from "next/dynamic";
import { Map as LeafletMap, LeafletMouseEvent } from "leaflet";
import styles from "./page.module.css";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });

export default function EditarUbicacionPage() {
  const { id } = useParams();
  const router = useRouter();
  const mapRef = useRef<LeafletMap | null>(null);

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

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const handleClick = (event: LeafletMouseEvent) => {
        const { lat, lng } = event.latlng;
        setForm((prev) => ({ ...prev, latitud: lat, longitud: lng }));
      };
      map.on("click", handleClick);

      return () => {
        map.off("click", handleClick);
      };
    }
  }, [form.latitud, form.longitud]);

  if (!ubicacion) {
    return (
      <LayoutShell>
        <h1>Ubicación no encontrada</h1>
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
          <MapContainer
            center={[form.latitud, form.longitud]}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
            ref={(instance) => {
              if (instance) mapRef.current = instance;
            }}
          >
            {/* usar google maps- pendient */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[form.latitud, form.longitud]} />
          </MapContainer>
        </div>

        <button type="submit" className={styles.submitButton}>
          Guardar Cambios
        </button>
      </form>
    </LayoutShell>
  );
}
