"use client";

import LayoutShell from "@/components/Layout/LayoutShell";
import UserCreateForm from "@/components/Users/UserCreateForm";
import styles from "./page.module.css";

export default function NuevoUsuarioPage() {
  return (
    <LayoutShell>
      <h1 className={styles.title}>Registrar Nuevo Usuario</h1>
      <UserCreateForm />
    </LayoutShell>
  );
}
