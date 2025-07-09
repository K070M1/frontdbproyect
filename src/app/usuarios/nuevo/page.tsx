"use client";

import UserCreateForm from "@/components/Users/UserCreateForm";
import styles from "./page.module.css";

export default function NuevoUsuarioPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registrar Nuevo Usuario</h1>
      <UserCreateForm />
    </div>
  );
}
