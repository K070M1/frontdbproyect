"use client";
import dynamic from "next/dynamic";

import styles from "./mapa.module.css";
const MapView = dynamic(() => import("@/components/Map/MapView/MapView"), {
  ssr: false,
});

export default function PublicMapaPage() {
  return (
    <div className={styles.container}>
      {/* <section className={styles.section_container}> */}
        <MapView />
      {/* </section> */}
    </div>
  );
}
