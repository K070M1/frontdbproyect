"use client";

import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import LayoutShell from "@/components/Layout/LayoutShell";
import RatingForm from "@/components/Ratings/RatingForm";
import { useAuth } from "@/context/AuthContext";

export default function NuevaCalificacionPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <LayoutShell>
        <RatingForm id_usuario={user?.id_usuario} />
      </LayoutShell>
    </ProtectedRoute>
  );
}
