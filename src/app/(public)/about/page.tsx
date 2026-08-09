import AboutPage from "@/views/AboutPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Since 2005, Accessiblexpress has helped businesses and families ship to 120+ countries with transparent pricing and real-time tracking.",
  path: "/about",
});

export default function Page() {
  return <AboutPage />;
}
