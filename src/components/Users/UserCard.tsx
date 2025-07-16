"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./UserCard.module.css";
import Button from "@/components/UI/Button/Button";
import ToastNotification from "@/components/UI/ToastNotification";
import { Usuario } from "@/types/entities/Usuario";
import Avatar from "@/components/UI/Avatar/Avatar";
import { useDeleteUser } from "@/services/querys/user.query";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

type UserCardProps = {
  isAdmin?: boolean;
} & Pick<
  Usuario,
  | "id_usuario"
  | "nombre_usuario"
  | "correo"
  | "rol"
  | "created_at"
  | "activo"
  | "avatar_url"
>;

export default function UserCard({
  id_usuario,
  nombre_usuario,
  correo,
  rol = "usuario",
  created_at,
  activo,
  avatar_url,
  isAdmin = false,
}: UserCardProps) {
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const { mutate: eliminarUsuario, isPending } = useDeleteUser();

  const handleDelete = () => {
    Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarUsuario(String(id_usuario), {
          onSuccess: (data) => {
            setToast({ message: data?.message || "Usuario eliminado", type: "success" });
            setTimeout(() => router.refresh(), 1500);
          },
          onError: (error: unknown) => {
            const msg = error instanceof Error ? error.message : "Error inesperado";
            setToast({ message: msg, type: "error" });
          },
        });
      }
    });
  };

  const avatarSrc = avatar_url
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${avatar_url.replace(/^\/+/, "")}`
    : undefined;

  return (
    <div className={styles.card}>
      <div className={styles.profileHeader}>
        <Avatar src={avatarSrc} name={nombre_usuario} size={60} />
        <h3 className={styles.title}>{nombre_usuario}</h3>
      </div>

      <p>
        <strong>Correo:</strong> {correo}
      </p>
      <p>
        <strong>Rol:</strong> {rol}
      </p>
      <p>
        <strong>Estado:</strong> {activo ? "Activo" : "Inactivo"}
      </p>
      <p>
        <strong>Registrado el:</strong> {new Date(created_at).toLocaleDateString()}
      </p>

      {isAdmin && (
        <div className={styles.actions}>
          <Button
            className={styles.editButton}
            onClick={() => router.push(`/usuarios/${id_usuario}/editar`)}
            disabled={isPending}
          >
            <FaEdit /> Editar
          </Button>
          <Button className={styles.deleteButton} onClick={handleDelete} disabled={isPending}>
            <FaTrash /> {isPending ? "Procesando..." : "Eliminar"}
          </Button>
        </div>
      )}

      {toast && <ToastNotification message={toast.message} type={toast.type} />}
    </div>
  );
}
