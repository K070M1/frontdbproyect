// CrearRutaDTO.ts
export type CrearRutaDTO = {
  id_origen: number;
  id_destino: number;
  riesgo: number;
  tiempo_estimado: string;
  favorito?: boolean;
};
