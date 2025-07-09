"use client";

import { ReactNode } from "react";
import ClientLayout from "./ClientLayout";
import LayoutShell from "./LayoutShell";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <ClientLayout>
      <LayoutShell>{children}</LayoutShell>
    </ClientLayout>
  );
}
