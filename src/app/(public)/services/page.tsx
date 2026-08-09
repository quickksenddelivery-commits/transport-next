import ServicesPage from "@/views/ServicesPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shipping & Logistics Services",
  description:
    "Express delivery, air freight, ocean shipping, warehousing, and customs clearance — all under one roof worldwide.",
  path: "/services",
});

export default function Page() {
  return <ServicesPage />;
}
