import CustomsPage from "@/views/CustomsPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Customs Clearance & Trade Services",
  description:
    "Licensed customs brokers for import/export clearance, IOR services, and trade consulting in 120+ countries.",
  path: "/customs",
});

export default function Page() {
  return <CustomsPage />;
}
