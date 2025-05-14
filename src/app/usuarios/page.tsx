"use client";

import LayoutShell from '@/components/Layout/LayoutShell';
import UserCard from '@/components/Users/UserCard';
import { mockUsers } from '@/data/mockUsers';
import ProtectedRoute from '@/components/Behavior/ProtectedRoute';

export default function UsuariosPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <LayoutShell>
        <h1>Usuarios Registrados</h1>
        {mockUsers.map((user) => (
          <UserCard
            key={user.id}
            nombre={user.nombre}
            correo={user.correo}
            rol={user.role}
            fechaRegistro={new Date().toISOString().split('T')[0]} // temporal (simula registro)
          />
        ))}
      </LayoutShell>
    </ProtectedRoute>
  );
}
