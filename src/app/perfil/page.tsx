"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LayoutShell from "@/components/Layout/LayoutShell";
import DetailView from "@/components/Forms/DetailView";
import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import Avatar from "@/components/UI/Avatar/Avatar";
import styles from "./page.module.css";

export default function PerfilPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const fields = [
    { label: "Nombre", value: user.username },
    { label: "Correo", value: user.correo },
    { label: "Rol", value: user.rol },
  ];

  const handleEditProfile = () => {
    router.push("/perfil/editar");
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <LayoutShell>
        <div className={styles.profileHeader}>
          <Avatar src={user.avatarUrl} name={user.username} size={80} />
          <h1 className={styles.title}>Perfil de Usuario</h1>
        </div>

        <DetailView title="Información Personal" fields={fields} />

        <div className={styles.containerBtnEditar}>
          <button onClick={handleEditProfile} className={styles.editButton}>
            Editar Perfil
          </button>
        </div>
      </LayoutShell>
    </ProtectedRoute>
  );
}
