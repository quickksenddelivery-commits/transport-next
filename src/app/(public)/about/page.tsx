import AboutPage from "@/views/AboutPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Accessiblexpress Logistics",
  description:
    "Since 2005, we have helped businesses and families ship parcels, freight, and household moves to 120+ countries with transparent pricing and real-time tracking.",
  path: "/about",
});

export default function Page() {
  return <AboutPage />;
}
