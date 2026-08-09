import PrivacyPolicyPage from "@/views/PrivacyPolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Accessiblexpress collects, uses, and protects your personal data.",
  path: "/legal/privacy",
  robots: { index: true, follow: true },
});

export default function Page() {
  return <PrivacyPolicyPage />;
}
