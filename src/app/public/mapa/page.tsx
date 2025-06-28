"use client";
import dynamic from "next/dynamic";

import LayoutShell from "@/components/Layout/LayoutShell";
import styles from "./mapa.module.css";
const MapView = dynamic(() => import("@/components/Map/MapView/MapView"), {
  ssr: false,
});

export default function PublicMapaPage() {
  return (
    <LayoutShell>
      <section className={styles.container}>
        <MapView />
      </section>
    </LayoutShell>
  );
}
