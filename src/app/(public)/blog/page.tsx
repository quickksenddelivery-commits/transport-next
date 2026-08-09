import BlogPage from "@/views/BlogPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shipping Blog",
  description:
    "Shipping guides, freight news, and logistics tips — duties, packaging, tracking, and international shipping explained.",
  path: "/blog",
});

export default function Page() {
  return <BlogPage />;
}
