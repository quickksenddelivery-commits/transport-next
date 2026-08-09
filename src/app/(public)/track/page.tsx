import { use } from "react";
import TrackPage from "@/views/TrackPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Track Your Shipment",
  description:
    "Enter your tracking number for real-time status updates on parcels, freight, and household moves worldwide.",
  path: "/track",
});

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const sp = use(searchParams);
  const q = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  return <TrackPage initialQ={q} />;
}
