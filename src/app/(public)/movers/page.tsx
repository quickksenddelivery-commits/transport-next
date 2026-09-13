import MoversPage from "@/views/MoversPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Household & Commercial Moving Services",
  description:
    "Professional household and office moving, plus international relocation — free survey, packing, full insurance, and flexible scheduling worldwide, door-to-door.",
  path: "/movers",
});

export default function Page() {
  return <MoversPage />;
}
