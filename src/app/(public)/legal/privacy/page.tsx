import PrivacyPolicyPage from "@/views/PrivacyPolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Accessiblexpress collects, uses, stores, and protects your personal data — full details about your privacy rights and our GDPR-compliant practices.",
  path: "/legal/privacy",
  robots: { index: true, follow: true },
});

export default function Page() {
  return <PrivacyPolicyPage />;
}
