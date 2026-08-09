'use client'
import { use } from 'react'
import AdminGuard from "@/components/AdminGuard";
import AdminShipmentDetail from "@/views/AdminShipmentDetail";
import { ParamsProvider } from "@/lib/router";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AdminGuard>
      <ParamsProvider params={{ id }}>
        <AdminShipmentDetail />
      </ParamsProvider>
    </AdminGuard>
  );
}
