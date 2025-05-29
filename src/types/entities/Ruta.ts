export interface Ruta {
  id_ruta: number;
  id_usuario: number;
  riesgo: number;
  tiempo_estimado: string; // ISO 8601 duration or hh:mm:ss string
  id_origen: number;
  id_destino: number;
  favorito: boolean;
}
