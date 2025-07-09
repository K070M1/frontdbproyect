"use client";

import { useRouter } from "next/navigation";
import UbicacionForm from "@/components/Ubicaciones/UbicacionForm";
import { useAddUbicacion } from "@/services/querys/ubicacion.query";
import { useNotify } from "@/context/NotificationContext";
import { CrearUbicacionDTO } from "@/types/dto/CrearUbicacionDTO";

import styles from "./page.module.css";

export default function NuevaUbicacionPage() {
  const router = useRouter();
  const notify = useNotify();
  const { mutateAsync } = useAddUbicacion();

  const handleCreateUbicacion = async (data: CrearUbicacionDTO) => {
    try {
      await mutateAsync(data);
      notify("success", "Ubicación creada exitosamente.");
      router.push("/ubicaciones");
    } catch (error) {
      console.error(error);
      notify("error", "Ocurrió un error al crear la ubicación.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Registrar Nueva Ubicación</h1>
      <UbicacionForm onSubmit={handleCreateUbicacion} />
    </div>
  );
}
