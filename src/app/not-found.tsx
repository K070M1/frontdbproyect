import Link from "next/link";
import Image from "next/image";
import styles from "./not-found.module.css";
import errorImage from "@/assets/ec9fc9bc-040a-4f70-9eb5-f1e8e8978bab.png";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Image
          src={errorImage}
          alt="Página no encontrada"
          className={styles.image}
          priority
        />
        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.description}>La ruta que buscas no existe.</p>
        <Link href="/" className={styles.button}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
