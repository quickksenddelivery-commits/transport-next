import type { Metadata } from "next";
import type { ReactNode } from "react";
import { validateEnv } from "@/server/config/env";

validateEnv();

export const metadata: Metadata = {
  title: "Accessiblexpress | Admin Portal",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
