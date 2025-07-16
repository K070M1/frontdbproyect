"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import UserCard from "@/components/Users/UserCard";
import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import Link from "next/link";
import styles from "./page.module.css";
import { useGetUsers } from "@/services/querys/user.query";
import ToastNotification from "@/components/UI/ToastNotification";

export default function UsuariosPage() {
  const { user: currentUser } = useAuth();
  const { data: users = [], isLoading, error } = useGetUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<"todos" | "activos" | "inactivos">("todos");
  const [rolFiltro, setRolFiltro] = useState<"todos" | "admin" | "usuario" | "moderador">("todos");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.correo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEstado =
        estadoFiltro === "todos"
          ? true
          : estadoFiltro === "activos"
          ? user.activo
          : !user.activo;

      const matchRol = rolFiltro === "todos" ? true : user.rol === rolFiltro;

      return matchSearch && matchEstado && matchRol;
    });
  }, [users, searchTerm, estadoFiltro, rolFiltro]);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Usuarios Registrados</h1>
          <Link href="/usuarios/nuevo" className={styles.addButton}>
            + Nuevo Usuario
          </Link>
        </div>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className={styles.selectInput}
            value={estadoFiltro}
            onChange={(e) =>
              setEstadoFiltro(e.target.value as "todos" | "activos" | "inactivos")
            }
          >
            <option value="todos">Todos</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
          <select
            className={styles.selectInput}
            value={rolFiltro}
            onChange={(e) =>
              setRolFiltro(e.target.value as "todos" | "admin" | "usuario" | "moderador")
            }
          >
            <option value="todos">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="usuario">Usuario</option>
            <option value="moderador">Moderador</option>
          </select>
        </div>

        {isLoading && <p className={styles.info}>Cargando usuarios...</p>}
        {error && (
          <ToastNotification
            message={
              error instanceof Error
                ? error.message
                : "Error al obtener usuarios"
            }
            type="error"
          />
        )}

        <div className={styles.list}>
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id_usuario}
              {...user}
              isAdmin={currentUser?.rol === "admin"}
            />
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
