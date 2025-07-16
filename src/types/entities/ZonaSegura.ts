import { LatLngTuple } from "leaflet";

export interface ZonaSegura {
  id_zona_segura: number;
  id_usuario: number;
  nombre: string;
  descripcion: string;
  area: LatLngTuple[]; // Representación simplificada del GEOGRAPHY(POLYGON, 4326)
}
