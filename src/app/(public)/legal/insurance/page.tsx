import InsuranceTermsPage from "@/views/InsuranceTermsPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Insurance Terms",
  description:
    "Coverage options and terms for shipments insured through Accessiblexpress.",
  path: "/legal/insurance",
  robots: { index: true, follow: true },
});

export default function Page() {
  return <InsuranceTermsPage />;
}
