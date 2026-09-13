import ContactPage from "@/views/ContactPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Our Global Logistics Team",
  description:
    "Get a quote, schedule a pickup, or speak with our logistics team — sales, support, and customs desks worldwide. We typically respond within 4 business hours.",
  path: "/contact",
});

export default function Page() {
  return <ContactPage />;
}
