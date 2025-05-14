"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LayoutShell from "@/components/Layout/LayoutShell";
import dynamic from "next/dynamic";
import { Map } from "leaflet"; 
import styles from "./page.module.css";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
import "leaflet/dist/leaflet.css";

export default function NuevaUbicacionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    latitud: -12.0464,
    longitud: -77.0428,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registrando ubicación:", form);
    router.push("/ubicaciones");
  };

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
          <MapContainer
            center={[form.latitud, form.longitud]}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
            whenReady={(e) => {
              const map: Map = e.target;
              map.on("click", (event) => {
                const { lat, lng } = event.latlng;
                setForm((prev) => ({ ...prev, latitud: lat, longitud: lng }));
              });
            }}
          >
            {/* google maps -pendient */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[form.latitud, form.longitud]} />
          </MapContainer>
        </div>

        <button type="submit" className={styles.submitButton}>
          Guardar
        </button>
      </form>
    </LayoutShell>
  );
}
