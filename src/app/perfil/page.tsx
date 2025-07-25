"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import DetailView from "@/components/Forms/DetailView";
import Avatar from "@/components/UI/Avatar/Avatar";
import styles from "./page.module.css";

export default function PerfilPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const fields = [
    { label: "Nombre", value: user.nombre_usuario || "No disponible" },
    { label: "Correo", value: user.correo || "No disponible" },
    ...(user.rol === "admin"
      ? [{ label: "Rol", value: user.rol }]
      : []),
    { label: "Estado", value: user.activo ? "Activo" : "Inactivo" },

    {
  label: "Fecha de Registro",
  value: user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "No disponible",
}


  ];

  const handleEditProfile = () => {
    router.push("/perfil/editar");
  };

  const avatarSrc = user.avatar_url
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${user.avatar_url.replace(/^\/+/, "")}`
    : undefined;

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario", "moderador"]}>
      <div className={styles.container}>
        <div className={styles.profileHeader}>
          <Avatar src={avatarSrc} name={user.nombre_usuario} size={80} />
          <h1 className={styles.title}>Perfil de Usuario</h1>
        </div>

        <DetailView title="Información Personal" fields={fields} />

        <div className={styles.containerBtnEditar}>
          <button onClick={handleEditProfile} className={styles.editButton}>
            Editar Perfil
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
