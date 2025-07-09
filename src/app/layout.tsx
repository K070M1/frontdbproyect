// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import WebProviders from "@/components/WebProviders";
import LayoutShell from "@/components/Layout/LayoutShell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TranquiRutas - Rutas Seguras",
  description: "Aplicación para la gestión de rutas seguras",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <WebProviders>
          <LayoutShell>{children}</LayoutShell>
        </WebProviders>
      </body>
    </html>
  );
}
