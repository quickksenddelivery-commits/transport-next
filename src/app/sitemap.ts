import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { CATALOGS, CATEGORY_META, type Category } from "@/data/serviceCatalog";

const CATEGORIES: Category[] = ["services", "freight", "movers", "customs"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/services", changeFrequency: "monthly", priority: 0.9 },
    { path: "/freight", changeFrequency: "monthly", priority: 0.9 },
    { path: "/movers", changeFrequency: "monthly", priority: 0.8 },
    { path: "/customs", changeFrequency: "monthly", priority: 0.8 },
    { path: "/track", changeFrequency: "weekly", priority: 0.9 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { path: "/press", changeFrequency: "monthly", priority: 0.5 },
    { path: "/help", changeFrequency: "monthly", priority: 0.7 },
    { path: "/sustainability", changeFrequency: "monthly", priority: 0.5 },
    { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/cookies", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/insurance", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/shipping", changeFrequency: "yearly", priority: 0.3 },
  ];

  const serviceUrls: MetadataRoute.Sitemap = CATEGORIES.flatMap(category =>
    CATALOGS[category].map(item => ({
      url: `${SITE_URL}${CATEGORY_META[category].path}/${item.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    } as MetadataRoute.Sitemap[number])),
  );

  return [
    ...routes.map(r => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...serviceUrls,
  ];
}
