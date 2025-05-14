"use client";

import { useAuth } from "@/context/AuthContext";
import LayoutShell from "@/components/Layout/LayoutShell";
import DetailView from "@/components/Forms/DetailView";
import ProtectedRoute from "@/components/Behavior/ProtectedRoute";

export default function PerfilPage() {
  const { user } = useAuth();

  if (!user) {
    return null; // Si no hay usuario, no renderizar nada (ya esta protegido por ProtectedRoute)
  }

  const fields = [
    { label: "Nombre", value: user.nombre },
    { label: "Correo", value: user.correo },
    { label: "Rol", value: user.role },
    { label: "Fecha de Registro", value: new Date(user.fechaRegistro).toLocaleDateString() },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <LayoutShell>
        <h1>Perfil de Usuario</h1>
        <DetailView title="Información Personal" fields={fields} />
      </LayoutShell>
    </ProtectedRoute>
  );
}
