"use client";

import { useEffect, useState } from "react";
import LayoutShell from "@/components/Layout/LayoutShell";
import UserCard from "@/components/Users/UserCard";
import ProtectedRoute from "@/components/Behavior/ProtectedRoute";

type User = {
  id_usuario: number;
  nombre_usuario: string;
  correo: string;
  rol: string;
  fecha_registro: string;
};

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutShell>
        <h1 className="text-2xl font-bold mb-4">Usuarios Registrados</h1>
        <div className="grid gap-4">
          {users.map((user) => (
            <UserCard
              key={user.id_usuario}
              nombre={user.nombre_usuario}
              correo={user.correo}
              rol={user.rol}
              fechaRegistro={user.fecha_registro.split("T")[0]}
            />
          ))}
        </div>
      </LayoutShell>
    </ProtectedRoute>
  );
}
