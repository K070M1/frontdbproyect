"use client";

import ProtectedRoute from "@/components/Behavior/ProtectedRoute";

import DashboardStats from "@/components/Dashboard/DashboardStats";
import ActiveRoutesList from "@/components/Dashboard/ActiveRoutesList";
import EventsList from "@/components/Dashboard/EventsList";
import SafeZonesList from "@/components/Dashboard/SafeZonesList";
import RatingsList from "@/components/Ratings/RatingsList";
import DashboardCharts from "@/components/Dashboard/DashboardCharts";

import { useAuth } from "@/context/AuthContext";

import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["admin", "usuario"]}>
      {/* Nota: NO hay LayoutShell aquí, ya lo envuelve app/layout.tsx */}
      <h1 className={styles.title}>Dashboard</h1>

      <section className={styles.section}>
        <DashboardStats />
      </section>

      {user?.rol === "admin" && (
        <section className={styles.section}>
          <DashboardCharts />
        </section>
      )}

      <section className={styles.section}>
        <ActiveRoutesList />
      </section>

      <section className={styles.section}>
        <EventsList />
      </section>

      <section className={styles.section}>
        <SafeZonesList />
      </section>

      <section className={styles.section}>
        <RatingsList />
      </section>
    </ProtectedRoute>
  );
}
