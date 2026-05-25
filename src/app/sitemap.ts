import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/utils";
import { PROPERTY_TYPES, BLOG_CATEGORIES } from "@/lib/constants";

/** Regenerate sitemap from MongoDB on each request (picks up new blogs/properties immediately). */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://www.kuberproperty.in";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/properties",
    "/blog",
    "/about",
    "/contact",
    "/areas",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  let properties: { slug: string; updatedAt: Date }[] = [];
  let blogs: { slug: string; updatedAt: Date }[] = [];
  let areas: { slug: string; updatedAt: Date }[] = [];

  try {
    [properties, blogs, areas] = await Promise.all([
      prisma.property.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blog.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.area.findMany({ select: { slug: true, updatedAt: true } }),
    ]);
  } catch {
    // DB not connected during build
  }

  const propertyRoutes = properties.map((p) => ({
    url: absoluteUrl(`/properties/${p.slug}`),
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const blogRoutes = blogs.map((b) => ({
    url: absoluteUrl(`/blog/${b.slug}`),
    lastModified: b.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const areaRoutes = areas.map((a) => ({
    url: absoluteUrl(`/areas/${a.slug}`),
    lastModified: a.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Remove query parameter URLs to avoid duplicate content issues
  // These are filter pages that can be accessed via the main pages
  return [...staticRoutes, ...propertyRoutes, ...blogRoutes, ...areaRoutes];
}
