import { Riesgo } from "@/types/enums/Riesgo";

export type ActualizarUbicacionDTO = {
  id_usuario: number;
  nombre?: string;
  descripcion?: string;
  latitud?: number;
  longitud?: number;
  riesgo?: Riesgo;
};
