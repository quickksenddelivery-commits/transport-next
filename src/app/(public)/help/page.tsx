import HelpCenterPage from "@/views/HelpCenterPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Help Center",
  description:
    "Answers about shipping, pricing, customs, and tracking. How to get a quote, ship internationally, and file claims.",
  path: "/help",
});

export default function Page() {
  return <HelpCenterPage />;
}
