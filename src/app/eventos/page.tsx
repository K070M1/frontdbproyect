"use client";

import Link from "next/link";
import LayoutShell from "@/components/Layout/LayoutShell";
import EventCard from "@/components/Events/EventCard";
import { mockEventos } from "@/data/mockEventos";
import styles from "./page.module.css";

export default function EventosPage() {
  return (
    <LayoutShell>
      <h1 className={styles.title}>Eventos Registrados</h1>

      <div className={styles.actions}>
        <Link href="/eventos/nuevo" className={styles.addButton}>
          + Nuevo Evento
        </Link>
      </div>

      <div className={styles.list}>
        {mockEventos.map((evento) => (
          <EventCard
            key={evento.id}
            tipo={evento.tipo}
            descripcion={evento.descripcion}
          />
        ))}
      </div>
    </LayoutShell>
  );
}
