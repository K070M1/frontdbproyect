"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import UbicacionForm from "@/components/Ubicaciones/UbicacionForm";
import { useGetUbicacionById, useUpdateUbicacion } from "@/services/querys/ubicacion.query";
import { ActualizarUbicacionDTO } from "@/types/dto/ActualizarUbicacionDTO";
import { useNotify } from "@/context/NotificationContext";

import styles from "./page.module.css";

export default function EditarUbicacionPage() {
  const { id } = useParams();
  const router = useRouter();
  const notify = useNotify();

  const { data: ubicacion, isLoading } = useGetUbicacionById(String(id));
  const updateUbicacion = useUpdateUbicacion();

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (ubicacion) {
      setForm({
        id_usuario: ubicacion.id_usuario ?? 0,
        nombre: ubicacion.nombre ?? "",
        descripcion: ubicacion.descripcion ?? "",
        latitud: ubicacion.latitud,
        longitud: ubicacion.longitud,
        riesgo: ubicacion.riesgo,
      });
    }
  }, [ubicacion]);

  const handleSubmit = async (data: ActualizarUbicacionDTO) => {
    try {
      await updateUbicacion.mutateAsync({ id: String(id), form: data });
      notify("success", "Ubicación actualizada correctamente.");
      router.push("/ubicaciones");
    } catch (error) {
      console.error(error);
      notify("error", "Error al actualizar la ubicación.");
    }
  };

  if (isLoading || !form) {
    return (
      <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      <div className={styles.container}>
        <h1>Cargando datos...</h1>
      </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
    <div className={styles.container}>
      <h1>Editar Ubicación</h1>
      <UbicacionForm initialData={form} onSubmit={handleSubmit} />
    </div>
    </ProtectedRoute>
  );
}
