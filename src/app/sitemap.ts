import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteConfig } from "@/config/site";

/** Regenerate at most once an hour so new products appear without a redeploy. */
export const revalidate = 3600;

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/shop", priority: 0.9, changeFrequency: "daily" },
  { path: "/gifts", priority: 0.9, changeFrequency: "weekly" },
  { path: "/cosmetics", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/track", priority: 0.4, changeFrequency: "yearly" },
  { path: "/shipping-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/returns", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  try {
    const [products, categories] = await Promise.all([
      db.product.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } }),
      db.category.findMany({
        select: {
          slug: true,
          products: { where: { status: "ACTIVE" }, select: { updatedAt: true }, orderBy: { updatedAt: "desc" }, take: 1 },
        },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    for (const c of categories) {
      entries.push({
        url: `${base}/category/${c.slug}`,
        lastModified: c.products[0]?.updatedAt ?? now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
    for (const p of products) {
      entries.push({ url: `${base}/product/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly", priority: 0.7 });
    }
  } catch (err) {
    // Database unavailable (e.g. during a build without DATABASE_URL): serve static routes only.
    console.error("[sitemap] could not load catalogue", err);
  }

  return entries;
}
