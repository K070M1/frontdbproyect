// CrearEventoDTO.ts
export type CrearEventoDTO = {
  id_tipo_evento: number;
  descripcion: string;
  ubicacion: GeoJSON.Point;
};
