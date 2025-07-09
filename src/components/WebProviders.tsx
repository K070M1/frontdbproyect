// frontend/src/components/WebProviders.tsx
"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import HeroProvider from "@/providers/HeroProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";

export default function WebProviders({ children }: { children: ReactNode }) {
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
