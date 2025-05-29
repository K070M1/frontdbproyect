import { LatLngTuple } from "leaflet";

export interface Evento {
  id_evento: number;
  id_tipo_evento: number;
  descripcion: string;
  id_usuario: number;
  fecha_registro: string; // ISO Date (TIMESTAMP)
  ubicacion: LatLngTuple; // Representación del GEOGRAPHY(POINT, 4326)
}
