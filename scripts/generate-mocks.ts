
import { faker } from "@faker-js/faker";
import { writeFileSync } from "fs";
import path from "path";

import { Ubicacion } from "@/types/entities/Ubicacion";
import { Ruta } from "@/types/entities/Ruta";
import { ZonaSegura } from "@/types/entities/ZonaSegura";
import { TipoEvento } from "@/types/entities/TipoEvento";
import { Evento } from "@/types/entities/Evento";
import { Calificacion } from "@/types/entities/Calificacion";
import { TipoCalificacion } from "@/types/enums/TipoCalificacion";
import { DetalleRuta } from "@/types/entities/DetalleRuta";
import { LatLngTuple } from "leaflet";

const OUTPUT_DIR = path.resolve(__dirname, "../src/data");

// -------- MOCK GENERATORS ---------

const generateUbicaciones = (): Ubicacion[] => [
  {
    id_ubicacion: 1,
    id_usuario: 2,
    latitud: -12.0464,
    longitud: -77.0428,
    nombre: "Plaza de Armas",
  },
  {
    id_ubicacion: 2,
    id_usuario: 2,
    latitud: -12.1209,
    longitud: -77.0305,
    nombre: "Parque Kennedy",
  },
];

const generateRutas = (): Ruta[] => [
  {
    id_ruta: 1,
    id_usuario: 2,
    riesgo: 3,
    tiempo_estimado: "00:25:00",
    id_origen: 1,
    id_destino: 2,
    favorito: true,
  },
  {
    id_ruta: 2,
    id_usuario: 2,
    riesgo: 5,
    tiempo_estimado: "00:15:00",
    id_origen: 2,
    id_destino: 1,
    favorito: false,
  },
];

const generateZonas = (): ZonaSegura[] => [
  {
    id_zona_segura: 1,
    id_usuario: 2,
    nombre: "Zona Segura - Miraflores",
    descripcion: "Área con vigilancia y buena iluminación.",
    area: [
      [-12.1209, -77.0305] as LatLngTuple,
      [-12.1215, -77.0295] as LatLngTuple,
      [-12.1220, -77.0300] as LatLngTuple,
    ],
  },
  {
    id_zona_segura: 2,
    id_usuario: 2,
    nombre: "Zona Segura - San Isidro",
    descripcion: "Zona residencial con patrullaje constante.",
    area: [
      [-12.0975, -77.0360] as LatLngTuple,
      [-12.0980, -77.0350] as LatLngTuple,
      [-12.0985, -77.0365] as LatLngTuple,
    ],
  },
];

const generateTipoEventos = (): TipoEvento[] => [
  { id_tipo_evento: 1, nombre: "Robo" },
  { id_tipo_evento: 2, nombre: "Accidente" },
];

const generateEventos = (): Evento[] => [
  {
    id_evento: 1,
    id_tipo_evento: 1,
    descripcion: "Asalto reportado en esquina Av. Brasil.",
    id_usuario: 2,
    fecha_registro: faker.date.recent().toISOString(),
    ubicacion: [-12.0609, -77.0450] as LatLngTuple,
  },
  {
    id_evento: 2,
    id_tipo_evento: 2,
    descripcion: "Accidente de tránsito cerca al Parque Kennedy.",
    id_usuario: 2,
    fecha_registro: faker.date.recent().toISOString(),
    ubicacion: [-12.1205, -77.0302] as LatLngTuple,
  },
  {
    id_evento: 3,
    id_tipo_evento: 1,
    descripcion: "Intento de robo en Av. Arequipa.",
    id_usuario: 2,
    fecha_registro: faker.date.recent().toISOString(),
    ubicacion: [-12.1123, -77.0333] as LatLngTuple,
  },
];

const generateCalificaciones = (): Calificacion[] => [
  {
    id_calificacion: 1,
    id_usuario: 2,
    calificacion: 5,
    comentario: "Muy buena iluminación y presencia policial.",
    id_evento: null,
    id_zona_segura: 1,
    tipo_calificacion: TipoCalificacion.ZonaSegura,
  },
  {
    id_calificacion: 2,
    id_usuario: 2,
    calificacion: 3,
    comentario: "La ruta es buena pero hay zonas oscuras.",
    id_evento: null,
    id_zona_segura: null,
    tipo_calificacion: TipoCalificacion.Ruta,
  },
];

const generateDetalleRuta = (): DetalleRuta[] => [
  {
    id_detalle_ruta: 1,
    id_ruta: 1,
    id_zona_segura: 1,
    id_evento: 1,
    fecha_registro: faker.date.recent().toISOString(),
  },
];

const generateEstadisticas = () => ({
  totalIncidentes: 152,
  zonasSegurasRegistradas: 2,
  rutasEvaluadas: 2,
  calificacionesTotales: 2,

  incidentesPorDistrito: [
    { distrito: 'Miraflores', incidentes: 12 },
    { distrito: 'San Isidro', incidentes: 8 },
  ],

  zonasMasSeguras: [
    { nombre: 'Parque Kennedy', nivelSeguridad: 5 },
    { nombre: 'Malecón de Miraflores', nivelSeguridad: 4 },
  ],

  evolucionIncidentes: [
    { mes: 'Enero', total: 10 },
    { mes: 'Febrero', total: 15 },
  ],
});

// -------- WRITE FILES ---------
const writeMock = (filename: string, data: object): void => {
  const filePath = path.join(OUTPUT_DIR, filename);
  const fileContent = `export const ${filename.replace(".ts", "")} = ${JSON.stringify(data, null, 2)};
`;
  writeFileSync(filePath, fileContent);
  console.log(`✅ ${filename} generado`);
};

writeMock("mockUbicaciones.ts", generateUbicaciones());
writeMock("mockRutas.ts", generateRutas());
writeMock("mockZonas.ts", generateZonas());
writeMock("mockTipoEventos.ts", generateTipoEventos());
writeMock("mockEventos.ts", generateEventos());
writeMock("mockCalificaciones.ts", generateCalificaciones());
writeMock("mockDetalleRuta.ts", generateDetalleRuta());
writeMock("mockEstadisticas.ts", generateEstadisticas());
