import HomePage from "@/views/HomePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Reliable Freight & Logistics Worldwide",
  description:
    "Accessiblexpress delivers parcels, freight, and household moves to 120+ countries with real-time tracking, same-day express, and door-to-door service.",
  path: "/",
});

export default function Page() {
  return <HomePage />;
}
