export const mockEstadisticas = {
  totalIncidentes: 152,
  zonasSegurasRegistradas: 25,
  rutasEvaluadas: 40,
  calificacionesTotales: 120,

  incidentesPorDistrito: [
    { distrito: 'Miraflores', incidentes: 12 },
    { distrito: 'San Isidro', incidentes: 8 },
    { distrito: 'La Victoria', incidentes: 20 },
    { distrito: 'Breña', incidentes: 15 },
    { distrito: 'Centro de Lima', incidentes: 30 },
  ],

  zonasMasSeguras: [
    { nombre: 'Parque Kennedy', nivelSeguridad: 5 },
    { nombre: 'Malecón de Miraflores', nivelSeguridad: 4 },
    { nombre: 'Parque Castilla', nivelSeguridad: 4 },
  ],

  evolucionIncidentes: [
    { mes: 'Enero', total: 10 },
    { mes: 'Febrero', total: 15 },
    { mes: 'Marzo', total: 12 },
    { mes: 'Abril', total: 20 },
    { mes: 'Mayo', total: 18 },
    { mes: 'Junio', total: 25 },
  ],
};
