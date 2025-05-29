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
        <h1>Registrar Nueva Calificación</h1>
        <RatingForm usuario={user?.username} />
      </LayoutShell>
    </ProtectedRoute>
  );
}
