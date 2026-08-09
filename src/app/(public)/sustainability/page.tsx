import SustainabilityPage from "@/views/SustainabilityPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sustainability",
  description:
    "Our commitment to greener logistics: carbon-neutral shipping options, efficient routing, and eco-friendly packaging.",
  path: "/sustainability",
});

export default function Page() {
  return <SustainabilityPage />;
}
