import SustainabilityPage from "@/views/SustainabilityPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sustainability & Green Logistics",
  description:
    "Our commitment to greener logistics: carbon-neutral shipping options, efficient route planning, and eco-friendly packaging across every shipment, worldwide.",
  path: "/sustainability",
});

export default function Page() {
  return <SustainabilityPage />;
}
