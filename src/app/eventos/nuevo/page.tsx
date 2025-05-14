"use client";

import LayoutShell from "@/components/Layout/LayoutShell";
import EventForm from "@/components/Events/EventForm";
import styles from "./page.module.css";

export default function NuevoEventoPage() {
  return (
    <LayoutShell>
      <h1 className={styles.title}>Registrar Nuevo Evento</h1>
      <EventForm />
    </LayoutShell>
  );
}
