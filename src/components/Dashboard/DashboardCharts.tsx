"use client";

import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

import { mockEstadisticas } from '@/data/mockEstadisticas';
import { mockCalificaciones } from '@/data/mockCalificaciones';
import styles from './DashboardCharts.module.css';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function DashboardCharts() {
  const incidentesData = {
    labels: mockEstadisticas.incidentesPorDistrito.map((d) => d.distrito),
    datasets: [
      {
        label: 'Incidentes Reportados',
        data: mockEstadisticas.incidentesPorDistrito.map((d) => d.incidentes),
        backgroundColor: '#2563eb',
      },
    ],
  };

  const zonasSegurasData = {
    labels: mockEstadisticas.zonasMasSeguras.map((z) => z.nombre),
    datasets: [
      {
        label: 'Nivel de Seguridad',
        data: mockEstadisticas.zonasMasSeguras.map((z) => z.nivelSeguridad),
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
      },
    ],
  };

  const tipos = ['zona_segura', 'ruta', 'evento'];
  const promedioPorTipo = tipos.map((tipo) => {
    const items = mockCalificaciones.filter((c) => c.tipo_calificacion === tipo);
    const total = items.reduce((acc, c) => acc + c.calificacion, 0);
    return items.length > 0 ? total / items.length : 0;
  });

  const calificacionesData = {
    labels: ['Zonas Seguras', 'Rutas', 'Eventos'],
    datasets: [
      {
        label: 'Calificación Promedio',
        data: promedioPorTipo,
        backgroundColor: ['#10b981', '#3b82f6', '#f97316'],
      },
    ],
  };

  const evolucionData = {
    labels: mockEstadisticas.evolucionIncidentes.map((e) => e.mes),
    datasets: [
      {
        label: 'Evolución de Incidentes',
        data: mockEstadisticas.evolucionIncidentes.map((e) => e.total),
        fill: false,
        borderColor: '#ef4444',
        tension: 0.3,
        pointBackgroundColor: '#ef4444',
      },
    ],
  };

  const calificacionesPorMes = [
    { mes: 'Enero', promedio: 4.2 },
    { mes: 'Febrero', promedio: 3.8 },
    { mes: 'Marzo', promedio: 4.0 },
    { mes: 'Abril', promedio: 4.5 },
    { mes: 'Mayo', promedio: 4.1 },
  ];

  const evolucionCalificacionesData = {
    labels: calificacionesPorMes.map((e) => e.mes),
    datasets: [
      {
        label: 'Evolución de Calificaciones',
        data: calificacionesPorMes.map((e) => e.promedio),
        fill: false,
        borderColor: '#10b981',
        tension: 0.3,
        pointBackgroundColor: '#10b981',
      },
    ],
  };

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Incidentes por Distrito</h2>
          <Bar data={incidentesData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Zonas Más Seguras</h2>
          <Pie data={zonasSegurasData} options={{ responsive: true }} />
        </div>

        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Calificación Promedio por Tipo</h2>
          <Bar data={calificacionesData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Evolución de Incidentes</h2>
          <Line data={evolucionData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
        </div>

        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Evolución de Calificaciones</h2>
          <Line data={evolucionCalificacionesData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
        </div>
      </div>
    </section>
  );
}
