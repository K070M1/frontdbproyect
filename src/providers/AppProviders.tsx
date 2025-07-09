"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
