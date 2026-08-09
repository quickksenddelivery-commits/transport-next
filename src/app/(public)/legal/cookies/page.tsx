import CookiePolicyPage from "@/views/CookiePolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cookie Policy",
  description:
    "How Accessiblexpress uses cookies and similar technologies to improve your experience.",
  path: "/legal/cookies",
  robots: { index: true, follow: true },
});

export default function Page() {
  return <CookiePolicyPage />;
}
