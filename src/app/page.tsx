// frontend/src/app/page.tsx
import Link from "next/link";
import Card from "@/components/UI/Card/Card";
import styles from "./page.module.css";

import { FaRegMap, FaRegCalendarAlt } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { FiMapPin } from "react-icons/fi";

export const metadata = {
  title: "TranquiRutas",
  description: "Explora rutas, zonas seguras y eventos.",
};

const links = [
  {
    href: "/mapa",
    icon: <FaRegMap className="size-20" />,
    title: "Mapa",
    description: "Visualiza rutas y zonas seguras en tiempo real.",
  },
  {
    href: "/rutas",
    icon: <FiMapPin className="size-20" />,
    title: "Rutas",
    description: "Consulta rutas disponibles con su nivel de riesgo.",
  },
  {
    href: "/zonas",
    icon: <IoIosSend className="size-20" />,
    title: "Zonas Seguras",
    description: "Descubre las zonas más seguras de tu ciudad.",
  },
  {
    href: "/eventos",
    icon: <FaRegCalendarAlt className="size-20" />,
    title: "Eventos",
    description: "Revisa eventos recientes que afectan la seguridad.",
  },
];

export default function HomePage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Bienvenido a TranquiRutas</h1>
      <p className={styles.subtitle}>
        Explora rutas, zonas seguras y eventos sin necesidad de registrarte.
      </p>

      <div className={styles.linksGrid}>
        {links.map(({ href, icon, title, description }) => (
          <Link href={href} key={href} className={styles.linkCard}>
            {icon}
            <h2>{title}</h2>
            <p>{description}</p>
          </Link>
        ))}
      </div>

      <Card>
        <p className={styles.info}>
          ¿Quieres participar activamente?{" "}
          <strong>
            Registra rutas, califica zonas o gestiona eventos
          </strong>{" "}
          iniciando sesión o creando una cuenta.{" "}
          <strong>¡Crea tu cuenta ahora!</strong>
        </p>
      </Card>
    </main>
  );
}
