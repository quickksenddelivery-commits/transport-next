import ServicesPage from "@/views/ServicesPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shipping & Logistics Services Worldwide",
  description:
    "Express delivery, air freight, ocean shipping, warehousing, and customs clearance — all from one trusted logistics partner, shipping to 120+ countries.",
  path: "/services",
});

export default function Page() {
  return <ServicesPage />;
}
