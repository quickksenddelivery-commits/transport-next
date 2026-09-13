import HelpCenterPage from "@/views/HelpCenterPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shipping Help Center, FAQ & Support",
  description:
    "Answers about shipping, pricing, customs, and tracking — how to get a quote, ship internationally, insure parcels, and file claims with our support team.",
  path: "/help",
});

export default function Page() {
  return <HelpCenterPage />;
}
