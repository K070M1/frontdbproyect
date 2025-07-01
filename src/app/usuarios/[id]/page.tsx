"use client";

import { useParams } from "next/navigation";
import LayoutShell from "@/components/Layout/LayoutShell";
import styles from "./page.module.css";
import ToastNotification from "@/components/UI/ToastNotification";
import { useGetUserById } from "@/services/querys/user.query";

export default function UsuarioDetallePage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, error, isLoading } = useGetUserById(id);

  return (
    <LayoutShell>
      <h1 className={styles.title}>Detalle de Usuario #{id}</h1>

      {error && (
        <ToastNotification
          message={
            error instanceof Error ? error.message : "Error inesperado"
          }
          type="error"
        />
      )}

      {isLoading && <p className={styles.info}>Cargando usuario...</p>}

      {user && (
        <>
          <p className={styles.info}><strong>Nombre:</strong> {user.nombre_usuario}</p>
          <p className={styles.info}><strong>Correo:</strong> {user.correo}</p>
          <p className={styles.info}><strong>Rol:</strong> {user.rol}</p>
          <p className={styles.info}><strong>Registrado el:</strong> {new Date(user.fecha_registro).toLocaleDateString()}</p>
          <p className={styles.info}><strong>Estado:</strong> {user.activo ? "Activo" : "Inactivo"}</p>
        </>
      )}
    </LayoutShell>
  );
}
