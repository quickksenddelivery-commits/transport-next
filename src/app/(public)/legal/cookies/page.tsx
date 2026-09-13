import CookiePolicyPage from "@/views/CookiePolicyPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cookie Policy",
  description:
    "How Accessiblexpress uses cookies and similar tracking technologies to improve your browsing experience. Learn how to manage cookie preferences in your browser.",
  path: "/legal/cookies",
  robots: { index: true, follow: true },
});

export default function Page() {
  return <CookiePolicyPage />;
}
