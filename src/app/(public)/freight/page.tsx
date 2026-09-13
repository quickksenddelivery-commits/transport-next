import FreightPage from "@/views/FreightPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Air, Ocean & Road Freight Forwarding",
  description:
    "End-to-end freight forwarding: express air cargo in 2–4 days, FCL/LCL ocean shipping, and cross-border road transport to 120+ countries worldwide, door-to-door.",
  path: "/freight",
});

export default function Page() {
  return <FreightPage />;
}
