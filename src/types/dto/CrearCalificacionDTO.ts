// CrearCalificacionDTO.ts
export type CrearCalificacionDTO = {
  calificacion: number;
  comentario: string;
  tipo_calificacion: string;
  id_evento?: number;
  id_zona_segura?: number;
};
