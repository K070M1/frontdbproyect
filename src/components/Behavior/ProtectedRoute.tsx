"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./ProtectedRoute.module.css";

export default function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;

    if (!user) {
      router.replace("/auth/login");
    } else if (!allowedRoles.includes(user.rol)) {
      router.replace("/unauthorized");
    }
  }, [user, isLoading, allowedRoles, router, mounted]);

  if (!mounted || isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.rol)) {
    return null;
  }

  return <>{children}</>;
}
