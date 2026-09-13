import ShippingPolicyPage from "@/views/ShippingPolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shipping Policy",
  description:
    "Delivery timeframes, service zones, prohibited items, and claim procedures for all Accessiblexpress shipments — everything you need to know before you ship.",
  path: "/legal/shipping",
  robots: { index: true, follow: true },
});

export default function Page() {
  return <ShippingPolicyPage />;
}
