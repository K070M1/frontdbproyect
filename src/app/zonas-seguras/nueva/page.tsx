"use client";

import LayoutShell from "@/components/Layout/LayoutShell";
import ZoneForm from "@/components/Zones/ZoneForm";
import styles from "./page.module.css";

export default function NuevaZonaSeguraPage() {
  return (
    <LayoutShell>
      <h1 className={styles.title}>Registrar Nueva Zona Segura</h1>
      <ZoneForm />
    </LayoutShell>
  );
}
