"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

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
    return <p>Verificando acceso...</p>;
  }

  if (!user || !allowedRoles.includes(user.rol)) {
    return null;
  }

  return <>{children}</>;
}
