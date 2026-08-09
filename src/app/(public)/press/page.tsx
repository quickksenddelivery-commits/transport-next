import PressPage from "@/views/PressPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Press & Media",
  description:
    "News, announcements, and press assets from Accessiblexpress. For media inquiries, contact our press desk.",
  path: "/press",
});

export default function Page() {
  return <PressPage />;
}
