"use client";

import LayoutShell from "@/components/Layout/LayoutShell";
import RouteCard from "@/components/Routes/RouteCard";
import { mockRutas } from "@/data/mockRutas";

export default function RutasFavoritasPage() {
  const favoritas = mockRutas.filter((ruta) => ruta.favorito);

  return (
    <LayoutShell>
      <h1>Rutas Favoritas</h1>
      {favoritas.map((ruta) => (
        <RouteCard
          key={ruta.id_ruta}
          origen={ruta.origen}
          destino={ruta.destino}
          riesgo={ruta.riesgo}
          tiempo={ruta.tiempo_estimado}
          favorito={ruta.favorito}
        />
      ))}
    </LayoutShell>
  );
}
