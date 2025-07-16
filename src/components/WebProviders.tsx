// frontend/src/components/WebProviders.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import HeroProvider from "@/providers/HeroProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { useSocketStore } from '@/services/socket'

export default function WebProviders({ children }: { children: ReactNode }) {
  const { initSocket } = useSocketStore();

  useEffect(() => {
    initSocket();
  }, [initSocket]); 

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <HeroProvider>
        <ReactQueryProvider>
          <AuthProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </HeroProvider>
    </ThemeProvider>
  );
}
