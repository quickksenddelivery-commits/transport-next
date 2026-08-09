import MoversPage from "@/views/MoversPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Household & Commercial Moving Services",
  description:
    "Professional moving for homes, offices, and international relocations. Free survey, full insurance, flexible scheduling.",
  path: "/movers",
});

export default function Page() {
  return <MoversPage />;
}
