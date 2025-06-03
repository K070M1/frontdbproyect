"use client";

import Link from "next/link";
import LayoutShell from "@/components/Layout/LayoutShell";
import Card from "@/components/UI/Card/Card";
import styles from "./page.module.css";
import { FaRegMap, FaRegCalendarAlt } from 'react-icons/fa'
import { IoIosSend } from 'react-icons/io'
import { FiMapPin } from 'react-icons/fi'

export default function HomePage() {
  return (
    <LayoutShell>
      <section className={styles.container}>
        <h1 className={`${styles.title} text-center`}>Bienvenido a TranquiRutas</h1>
        <p className={`${styles.subtitle} text-center -mt-5`}>
          Explora rutas, zonas seguras y eventos sin necesidad de registrarte.
        </p>

        <div className="grid grid-cols-4 gap-10">
          <Link href="/public/mapa" className={styles.linkCard}>
            <FaRegMap className="size-20" />
            <h2 className="mt-2">Mapa</h2>
            <p>Visualiza rutas y zonas seguras en tiempo real.</p>
          </Link>

          <Link href="/rutas" className={styles.linkCard}>
            <FiMapPin className="size-20" />
            <h2 className="mt-2">Rutas</h2>
            <p>Consulta rutas disponibles con su nivel de riesgo.</p>
          </Link>

          <Link href="/zonas" className={styles.linkCard}>
            <IoIosSend className="size-20" />
            <h2 className="mt-2">Zonas Seguras</h2>
            <p>Descubre las zonas más seguras de tu ciudad.</p>
          </Link>

          <Link href="/eventos" className={styles.linkCard}>
            <FaRegCalendarAlt className="size-20" />
            <h2 className="mt-2">Eventos</h2>
            <p>Revisa eventos recientes que afectan la seguridad.</p>
          </Link>
        </div>

        {/* <Card>
          <p className={styles.info}>
            Para registrar rutas, calificar zonas o gestionar eventos,
            inicia sesión o crea una cuenta.
          </p>
        </Card> */}
      </section>
    </LayoutShell>
  );
}
