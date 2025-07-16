"use client";

import { ReactNode, useEffect, useState } from "react";
import ClientLayout from "./ClientLayout";
import LayoutShell from "./LayoutShell";
import styles from "./PageLayout.module.css";

export default function PageLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula tiempo de compilación
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ClientLayout>
      {loading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.spinner} />
          <p>Cargando...</p>
        </div>
      ) : (
        <LayoutShell>{children}</LayoutShell>
      )}
    </ClientLayout>
  );
}
