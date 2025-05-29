"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import LayoutShell from "@/components/Layout/LayoutShell";
import DetailView from "@/components/Forms/DetailView";
import RatingStars from "@/components/Ratings/RatingStars";

import { mockCalificaciones } from "@/data/mockCalificaciones";

export default function CalificacionDetallePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const calificacion = mockCalificaciones.find(
    (r) => r.id_calificacion === Number(id)
  );

  if (!calificacion) {
    return (
      <ProtectedRoute allowedRoles={["admin", "usuario"]}>
        <LayoutShell>
          <h1>Calificación no encontrada</h1>
        </LayoutShell>
      </ProtectedRoute>
    );
  }

  // 🔒 Validar que usuario solo vea su propia calificación
  if (user?.rol === "usuario" && calificacion.id_usuario !== user.id_usuario) {
    router.replace("/unauthorized");
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <LayoutShell>
        <h1>Detalle de Calificación ID: {id}</h1>

        <RatingStars score={calificacion.calificacion} />

        <DetailView
          title="Detalle de la Calificación"
          fields={[
            { label: "ID Usuario", value: calificacion.id_usuario },
            { label: "Tipo", value: calificacion.tipo_calificacion },
            {
              label: "Relacionado con",
              value:
                calificacion.id_zona_segura !== null
                  ? `Zona #${calificacion.id_zona_segura}`
                  : calificacion.id_evento !== null
                  ? `Evento #${calificacion.id_evento}`
                  : "No especificado",
            },
            { label: "Comentario", value: calificacion.comentario },
            { label: "Puntuación", value: calificacion.calificacion.toString() },
          ]}
        />
      </LayoutShell>
    </ProtectedRoute>
  );
}
