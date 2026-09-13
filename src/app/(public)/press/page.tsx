import PressPage from "@/views/PressPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Press & Media",
  description:
    "News, press releases, brand assets, and media kits from Accessiblexpress. For all media inquiries, contact our dedicated press desk for a fast reply today.",
  path: "/press",
});

export default function Page() {
  return <PressPage />;
}
