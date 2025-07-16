"use client";

import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import RouteForm from "@/components/Routes/RouteForm";
import styles from "../page.module.css";

export default function NuevaRutaPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <div className={styles.container}>
        <h1>Registrar Nueva Ruta</h1>
        <RouteForm />
      </div>
    </ProtectedRoute>
  );
}
