import ShippingPolicyPage from "@/views/ShippingPolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shipping Policy",
  description:
    "Delivery timeframes, zones, prohibited items, and claim procedures for Accessiblexpress shipments.",
  path: "/legal/shipping",
  robots: { index: true, follow: true },
});

export default function Page() {
  return <ShippingPolicyPage />;
}
