"use client";

import Link from "next/link";
import LayoutShell from "@/components/Layout/LayoutShell";
import Card from "@/components/UI/Card/Card";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <LayoutShell>
      <section className={styles.container}>
        <h1 className={styles.title}>Bienvenido a Rutas Seguras</h1>
        <p className={styles.subtitle}>
          Explora rutas, zonas seguras y eventos sin necesidad de registrarte.
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
            Para registrar rutas, calificar zonas o gestionar eventos,
            inicia sesión o crea una cuenta.
          </p>
        </Card>
      </section>
    </LayoutShell>
  );
}
