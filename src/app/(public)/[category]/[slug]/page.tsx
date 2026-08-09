import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ServiceDetailView from "@/views/ServiceDetailView";
import JsonLd from "@/components/JsonLd";
import { CATALOGS, CATEGORY_META, type Category, type ServiceDetail } from "@/data/serviceCatalog";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const CATEGORIES: Category[] = ["services", "freight", "movers", "customs"];

export function generateStaticParams() {
  return CATEGORIES.flatMap(category =>
    CATALOGS[category].map(item => ({ category, slug: item.slug })),
  );
}

function findItem(category: string, slug: string): { item: ServiceDetail; path: string } | null {
  if (!CATEGORIES.includes(category as Category)) return null;
  const cat = category as Category;
  const item = CATALOGS[cat].find(i => i.slug === slug);
  return item ? { item, path: CATEGORY_META[cat].path } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const found = findItem(category, slug);
  if (!found) return {};
  const { item, path } = found;
  const canonical = `${SITE_URL}${path}/${item.slug}`;
  return {
    title: item.title,
    description: item.desc,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: SITE_NAME,
      title: item.title,
      description: item.desc,
      images: [item.img],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.desc,
      images: [item.img],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const found = findItem(category, slug);
  if (!found) notFound();
  const { item, path } = found;
  const canonical = `${SITE_URL}${path}/${item.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: item.title,
          name: item.title,
          description: item.longDesc,
          url: canonical,
          image: item.img,
          provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: CATEGORY_META[category as Category].label, item: `${SITE_URL}${path}` },
            { "@type": "ListItem", position: 3, name: item.title, item: canonical },
          ],
        }}
      />
      <ServiceDetailView category={category as Category} slug={slug} />
    </>
  );
}
