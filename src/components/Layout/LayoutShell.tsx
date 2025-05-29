"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import styles from "./LayoutShell.module.css";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.mainContainer}>
        {user ? <Sidebar /> : null}
        <main className={styles.content}>
          {user && <Breadcrumbs />}
          {children}
        </main>
      </div>
    </div>
  );
}
