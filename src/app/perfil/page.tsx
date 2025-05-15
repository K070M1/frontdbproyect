"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LayoutShell from "@/components/Layout/LayoutShell";
import DetailView from "@/components/Forms/DetailView";
import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import styles from "./page.module.css";

export default function PerfilPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null; // protegido ya por ProtectedRoute

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
        <h1 className={styles.title}>Perfil de Usuario</h1>
        <DetailView title="Información Personal" fields={fields} />

        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={handleEditProfile}
            className={styles.editButton}
          >
            Editar Perfil
          </button>
        </div>
      </LayoutShell>
    </ProtectedRoute>
  );
}
