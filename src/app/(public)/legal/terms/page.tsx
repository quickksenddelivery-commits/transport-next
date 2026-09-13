import TermsOfServicePage from "@/views/TermsOfServicePage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms governing use of the Accessiblexpress website, international shipping, and logistics services. Read about user responsibilities and limitations.",
  path: "/legal/terms",
  robots: { index: true, follow: true },
});

export default function Page() {
  return <TermsOfServicePage />;
}
