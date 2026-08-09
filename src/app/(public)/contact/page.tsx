import ContactPage from "@/views/ContactPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Get a quote, schedule a pickup, or talk to our logistics team. Sales, support, and customs desks worldwide.",
  path: "/contact",
});

export default function Page() {
  return <ContactPage />;
}
