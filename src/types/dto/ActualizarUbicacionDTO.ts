import { Riesgo } from "@/types/enums/Riesgo";

export type ActualizarUbicacionDTO = {
  nombre?: string;
  descripcion?: string;
  latitud?: number;
  longitud?: number;
  riesgo?: Riesgo;
};
