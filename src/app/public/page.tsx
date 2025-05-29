"use client";

import Link from "next/link";
import LayoutShell from "@/components/Layout/LayoutShell";
import Card from "@/components/UI/Card/Card";
import styles from "../page.module.css"; // Reutilizas el page.module.css del raíz

export default function PublicLandingPage() {
  return (
    <LayoutShell>
      <section className={styles.container}>
        <h1 className={styles.title}>Explora Rutas y Zonas Seguras</h1>
        <p className={styles.subtitle}>
          Acceso público a información de seguridad vial y eventos.
        </p>

        <div className={styles.linksGrid}>
          <Link href="/public/mapa" className={styles.linkCard}>
            <h2>Mapa</h2>
            <p>Visualiza rutas y zonas seguras en tiempo real.</p>
          </Link>

          <Link href="/rutas" className={styles.linkCard}>
            <h2>Rutas</h2>
            <p>Consulta rutas disponibles con su nivel de riesgo.</p>
          </Link>

          <Link href="/zonas" className={styles.linkCard}>
            <h2>Zonas Seguras</h2>
            <p>Descubre las zonas más seguras de tu ciudad.</p>
          </Link>

          <Link href="/eventos" className={styles.linkCard}>
            <h2>Eventos</h2>
            <p>Revisa eventos recientes que afectan la seguridad.</p>
          </Link>
        </div>

        <Card>
          <p className={styles.info}>
            Para acceder a más funciones, inicia sesión o regístrate.
          </p>
        </Card>
      </section>
    </LayoutShell>
  );
}
