import { Riesgo } from "@/types/enums/Riesgo";

export interface Ubicacion {
  id_ubicacion: number;
  id_usuario: number;
  latitud: number;
  longitud: number;
  nombre: string | null;
  descripcion?: string | null;
  riesgo?: Riesgo;
  createdAt: string;  // ISO date
  updatedAt: string;  // ISO date
}
