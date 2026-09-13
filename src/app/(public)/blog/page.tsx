import BlogPage from "@/views/BlogPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Logistics & Shipping Insights Blog",
  description:
    "Shipping guides, freight news, and actionable logistics tips — duties, packaging, tracking, and international shipping explained in plain English and pro tips.",
  path: "/blog",
});

export default function Page() {
  return <BlogPage />;
}
