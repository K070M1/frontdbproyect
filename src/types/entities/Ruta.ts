export interface Ruta {
  id_ruta: number;
  id_usuario: number;
  id_origen: number;
  id_destino: number;
  riesgo: number;
  tiempo_estimado: string;
  favorito: boolean;
  origen: string;
  origen_direccion: string;
  destino: string;
  destino_direccion: string;
}

// Payload para registrar nueva ruta desde frontend (formulario)
export interface CrearRutaPayload {
  id_usuario: number;
  origenCoords: { lat: number; lng: number };
  destinoCoords: { lat: number; lng: number };
  origen?: string;
  destino?: string;
  origenAddress?: string;
  destinoAddress?: string;
  riesgo?: number;
  tiempo_estimado?: string;
  favorito?: boolean;
}

// Payload para actualización (excluye ID principal)
export type ActualizarRutaPayload = Omit<Ruta, "id_ruta" | "origen" | "destino" | "origen_direccion" | "destino_direccion">;
