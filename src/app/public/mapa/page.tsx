"use client";

import LayoutShell from "@/components/Layout/LayoutShell";
import MapView from "@/components/Map/MapView/MapView";
import styles from "./mapa.module.css";

export default function PublicMapaPage() {
  return (
    <LayoutShell>
      <section className={styles.container}>
        <MapView />
      </section>
    </LayoutShell>
  );
}
