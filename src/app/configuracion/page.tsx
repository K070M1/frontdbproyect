"use client";

import { useState } from "react";
import LayoutShell from "@/components/Layout/LayoutShell";
import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import UserForm from "@/components/Configuracion/UserForm";
import { mockUsers } from "@/data/mockUsers";
import styles from "./page.module.css";

type UserData = {
  id: number;
  nombre: string;
  rol: string;
  correo: string;
};

export default function ConfiguracionPage() {
  const [tab, setTab] = useState<"general" | "usuarios" | "roles">("general");

  const [usuarios, setUsuarios] = useState<UserData[]>(
    mockUsers.map((u) => ({
      id: u.id,
      nombre: u.username === "admin" ? "Administrador" : "Usuario",
      rol: u.role,
      correo: `${u.username}@example.com`,
    }))
  );

  const handleUpdateUsuario = (id: number, data: Omit<UserData, "id">) => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
    alert("Usuario actualizado correctamente.");
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <LayoutShell>
        <h1 className={styles.title}>Configuración</h1>

        <div className={styles.tabs}>
          {["general", "usuarios", "roles"].map((tabKey) => (
            <button
              key={tabKey}
              className={`${styles.tabButton} ${tab === tabKey ? styles.tabButtonActive : ""}`}
              onClick={() => setTab(tabKey as typeof tab)}
            >
              {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
            </button>
          ))}
        </div>

        {tab === "general" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Opciones Generales</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>Gestión de usuarios</li>
              <li className={styles.listItem}>Permisos y roles</li>
              <li className={styles.listItem}>Parámetros del sistema</li>
            </ul>
          </section>
        )}

        {tab === "usuarios" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Editar Usuarios</h2>
            {usuarios.map((user) => (
              <UserForm
                key={user.id}
                initialData={user}
                onSubmit={(data) => handleUpdateUsuario(user.id, data)}
              />
            ))}
          </section>
        )}

        {tab === "roles" && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Roles Disponibles</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>admin</li>
              <li className={styles.listItem}>usuario</li>
              <li className={styles.listItem}>moderador</li>
            </ul>
          </section>
        )}
      </LayoutShell>
    </ProtectedRoute>
  );
}
