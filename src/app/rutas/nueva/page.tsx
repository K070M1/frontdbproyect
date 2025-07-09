"use client";

import RouteForm from "@/components/Routes/RouteForm";
import styles from "./page.module.css";

export default function NuevaRutaPage() {
  return (
    <div className={styles.container}>
      <h1>Registrar Nueva Ruta</h1>
      <RouteForm />
    </div>
  );
}
