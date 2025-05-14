"use client";

import Link from "next/link";
import LayoutShell from "@/components/Layout/LayoutShell";
import ZoneCard from "@/components/Zones/ZoneCard";
import { mockZonas } from "@/data/mockZonas";
import styles from "./page.module.css";

export default function ZonasSegurasPage() {
  return (
    <LayoutShell>
      <h1 className={styles.title}>Zonas Seguras</h1>

      <div className={styles.actions}>
        <Link href="/zonas-seguras/nueva" className={styles.addButton}>
          + Nueva Zona Segura
        </Link>
      </div>

      <div className={styles.list}>
        {mockZonas.map((zone) => (
          <ZoneCard
            key={zone.id}
            nombre={zone.nombre}
            descripcion={zone.descripcion}
          />
        ))}
      </div>
    </LayoutShell>
  );
}
