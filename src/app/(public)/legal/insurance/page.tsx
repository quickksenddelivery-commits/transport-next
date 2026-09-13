import InsuranceTermsPage from "@/views/InsuranceTermsPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Insurance Terms",
  description:
    "Coverage options, claim procedures, and full terms for shipments insured through Accessiblexpress — see what is covered, what is excluded, and how to claim.",
  path: "/legal/insurance",
  robots: { index: true, follow: true },
});

export default function Page() {
  return <InsuranceTermsPage />;
}
