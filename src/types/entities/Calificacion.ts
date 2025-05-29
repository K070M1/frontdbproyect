import { TipoCalificacion } from "@/types/enums/TipoCalificacion";

export interface Calificacion {
  id_calificacion: number;
  id_usuario: number;
  calificacion: number;
  comentario: string;
  id_evento: number | null;
  id_zona_segura: number | null;
  tipo_calificacion: TipoCalificacion;
}
