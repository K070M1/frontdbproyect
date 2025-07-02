import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import HeroProvider from "@/providers/HeroProvider";
import { NotificationProvider } from "@/context/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DB Frontend Proyect",
  description: "Pending description...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <HeroProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </HeroProvider>
      </body>
    </html>
  );
}
