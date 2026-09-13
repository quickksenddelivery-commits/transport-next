import CustomsPage from "@/views/CustomsPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Customs Clearance & Trade Services",
  description:
    "Licensed customs brokers for import and export clearance, IOR services, and trade consulting in 120+ countries — fast, fully compliant, and duty-optimized.",
  path: "/customs",
});

export default function Page() {
  return <CustomsPage />;
}
