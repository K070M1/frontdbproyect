"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import LayoutShell from "@/components/Layout/LayoutShell";
import DetailView from "@/components/Forms/DetailView";
import RatingStars from "@/components/Ratings/RatingStars";
import { useGetCalification } from '@/services/querys/calification.query'
import Form from '@/components/Ratings/RatingForm'

export default function CalificacionDetallePage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [calification, setCalification] = useState<any>([]);
  const { mutateAsync: getCalification, isPending } = useGetCalification();

  useEffect(() => {
    const fetchCalification = async () => {
      const data = await getCalification(id as any);
      setCalification(data);
    };

    if (id) {
      fetchCalification();
    }
  }, [id]);

  if (isPending) {
    return (
      <ProtectedRoute allowedRoles={["admin", "usuario"]}>
        <LayoutShell>
          <h1>Cargando...</h1>
        </LayoutShell>
      </ProtectedRoute>
    );
  }

  // 🔒 Validar que usuario solo vea su propia calificación
  /* if (user?.rol === "usuario" && calification.id_usuario !== user.id_usuario) {
    router.replace("/unauthorized");
    return null;
  } */

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <LayoutShell>
        <Form initialData={calification} />
      </LayoutShell>
    </ProtectedRoute>
  );
}
