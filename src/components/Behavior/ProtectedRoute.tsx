"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { mockUserAuth } from "@/data/mockUserAuth";

export default function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!mockUserAuth) {
      router.push("/login");
    } else if (!allowedRoles.includes(mockUserAuth.role)) {
      router.push("/unauthorized");
    } else {
      setChecking(false);
    }
  }, [allowedRoles, router]);

  if (checking) return <p>Verificando acceso...</p>;

  return <>{children}</>;
}
