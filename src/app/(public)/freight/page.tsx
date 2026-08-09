import FreightPage from "@/views/FreightPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Air, Ocean & Road Freight",
  description:
    "End-to-end freight forwarding: air cargo in 2–4 days, FCL/LCL ocean shipping, and cross-border road transport to 120+ countries.",
  path: "/freight",
});

export default function Page() {
  return <FreightPage />;
}
