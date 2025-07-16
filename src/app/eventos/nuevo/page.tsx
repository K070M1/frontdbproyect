"use client";

import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import EventForm from "@/components/Events/EventForm";
import styles from "./page.module.css";

export default function NuevoEventoPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <div className={styles.container}>
        <h3 className={styles.title}>Registrar Nuevo Evento</h3>
        <EventForm />
      </div>
    </ProtectedRoute>
  );
}
