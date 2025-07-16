"use client";

import { useGetEvents } from "@/services/querys/event.query";
import { useGetZones } from "@/services/querys/zone.query";
import { useGetRoutes } from "@/services/querys/routes.query";
import { useGetCalifications } from "@/services/querys/calification.query";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import styles from "./DashboardCharts.module.css";

export default function DashboardCharts() {
  // Hooks de datos
  const { data: events = [], isLoading: loadingEvents } = useGetEvents();
  const { data: zones = [], isLoading: loadingZones } = useGetZones();
  const { data: routes = [], isLoading: loadingRoutes } = useGetRoutes();
  const { data: califications = [], isLoading: loadingCalifications } =
    useGetCalifications();

  const isLoading =
    loadingEvents || loadingZones || loadingRoutes || loadingCalifications;

  if (isLoading) {
    return <p>Cargando gráficos...</p>;
  }

  //
  // 1. Incidentes por Tipo de Evento (usamos tipo_nombre de events)
  //
  const incidentesPorTipo = events.reduce(
    (acc:any, ev:any) => {
      const key = ev.tipo_nombre || "Desconocido";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {}
  );
  const incidentesPorTipoData = Object.entries(incidentesPorTipo).map(
    ([tipo, count]) => ({ tipo, count })
  );
  const incidentesColors = ["#2563eb", "#ef4444", "#10b981", "#f59e0b"];

  //
  // 2. Zonas más seguras (top 5 por area_m2)
  //
  // zones tienen area_m2
  const zonasSorted = [...zones]
    .sort((a: any, b: any) => b.area_m2 - a.area_m2)
    .slice(0, 5)
    .map((z: any) => ({
      nombre: z.nombre,
      nivel: Math.round(z.area_m2),
    }));
  const zonaColors = ["#10b981", "#3b82f6", "#f59e0b", "#a78bfa", "#f87171"];

  //
  // 3. Rutas favoritas vs no favoritas
  //
  const favCount = routes.filter((r: any) => r.favorito).length;
  const noFavCount = routes.length - favCount;
  const rutasData = [
    { tipo: "Favoritas", count: favCount },
    { tipo: "Otras", count: noFavCount },
  ];
  const rutasColors = ["#3b82f6", "#60a5fa"];

  //
  // 4. Evolución de Incidentes (por mes)
  //
  const incidenteByMonth = events.reduce((acc:any, ev:any) => {
    const date = new Date(ev.fecha_registro);
    const month = date.toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const evolucionIncidentesData = Object.entries(incidenteByMonth).map(
    ([mes, total]) => ({ mes, total })
  );

  //
  // 5. Evolución de Calificaciones (por mes, a partir de califications.created_at)
  //
  const califByMonth = califications.reduce((acc:any, c:any) => {
    const date = new Date(c.created_at);
    const month = date.toLocaleString("default", { month: "short" });
    (acc[month] = acc[month] || []).push(c.calificacion);
    return acc;
  }, {});
  const evolucionCalificacionesData = Object.entries(califByMonth).map(
    ([mes, arr]: [any, any]) => ({
      mes,
      promedio: Math.round((arr.reduce((a:any, b:any) => a + b, 0) / arr.length) * 10) / 10,
    })
  );

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {/* Incidentes por Tipo de Evento */}
        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Incidentes por Tipo</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incidentesPorTipoData}
                dataKey="count"
                nameKey="tipo"
                outerRadius={100}
                label
              >
                {incidentesPorTipoData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={incidentesColors[idx % incidentesColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Zonas Más Seguras */}
        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Top Zonas por Área</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={zonasSorted}>
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="nivel">
                {zonasSorted.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={zonaColors[idx % zonaColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rutas Favoritas vs Otras */}
        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Rutas Favoritas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={rutasData}
                dataKey="count"
                nameKey="tipo"
                innerRadius={50}
                outerRadius={80}
                label
              >
                {rutasData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={rutasColors[idx % rutasColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Evolución de Incidentes */}
        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Evolución de Incidentes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucionIncidentesData}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#ef4444"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Evolución de Calificaciones */}
        <div className={styles.chartContainer}>
          <h2 className={styles.chartTitle}>Evolución de Calificaciones</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucionCalificacionesData}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="promedio"
                stroke="#10b981"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
