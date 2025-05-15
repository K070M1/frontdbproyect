import ProtectedRoute from "@/components/Behavior/ProtectedRoute";
import LayoutShell from "@/components/Layout/LayoutShell";
import DashboardStats from '@/components/Dashboard/DashboardStats';
import ActiveRoutesList from '@/components/Dashboard/ActiveRoutesList';
import EventsList from '@/components/Dashboard/EventsList';
import SafeZonesList from '@/components/Dashboard/SafeZonesList';
import RatingsList from '@/components/Ratings/RatingsList';
import DashboardCharts from '@/components/Dashboard/DashboardCharts';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <LayoutShell>
        <h1 className={styles.title}>Dashboard</h1>

        <div className={styles.section}>
          <DashboardStats />
        </div>

        <div className={styles.section}>
          <DashboardCharts />
        </div>

        <div className={styles.section}>
          <ActiveRoutesList />
        </div>

        <div className={styles.section}>
          <EventsList />
        </div>

        <div className={styles.section}>
          <SafeZonesList />
        </div>

        <div className={styles.section}>
          <RatingsList />
        </div>
      </LayoutShell>
    </ProtectedRoute>
  );
}
