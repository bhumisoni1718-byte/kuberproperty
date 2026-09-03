import { prisma } from "@/lib/prisma";
import type { PropertyStatus } from "@prisma/client";

export type PropertyFilters = {
  q?: string;
  city?: string;
  type?: string;
  listingType?: string;
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  possession?: string;
  featured?: boolean;
  areaSlug?: string;
  builder?: string;
  sort?: string;
  page?: number;
  limit?: number;
  status?: PropertyStatus;
};

export async function getProperties(filters: PropertyFilters = {}) {
  const {
    q,
    city,
    type,
    bedrooms,
    minPrice,
    maxPrice,
    featured,
    areaSlug,
    builder,
    sort = "newest",
    page = 1,
    limit = 12,
    status = "PUBLISHED",
  } = filters;

  const where: Record<string, unknown> = { status };

  if (city) where.city = { contains: city, mode: "insensitive" };
  if (type) where.propertyType = type;
  if (bedrooms) where.bedrooms = bedrooms;
  if (featured) where.featured = true;
  if (builder) where.builder = { contains: builder, mode: "insensitive" };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, number>).gte = minPrice;
    if (maxPrice) (where.price as Record<string, number>).lte = maxPrice;
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
    ];
  }
  if (areaSlug) {
    where.area = { slug: areaSlug };
  }

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
        ? { price: "desc" as const }
        : sort === "area"
          ? { areaSqFt: "desc" as const }
          : { publishedAt: "desc" as const };

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        createdBy: { select: { name: true, image: true, phone: true } },
        area: { select: { name: true, slug: true } },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return { items, total, pages: Math.ceil(total / limit), page };
}

export async function getPropertyBySlug(slug: string) {
  return prisma.property.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      createdBy: { select: { id: true, name: true, email: true, phone: true, image: true, bio: true } },
      area: true,
      category: true,
    },
  });
}

export async function getSimilarProperties(
  propertyId: string,
  city: string,
  propertyType: string,
  limit = 4
) {
  return prisma.property.findMany({
    where: {
      id: { not: propertyId },
      status: "PUBLISHED",
      city,
      propertyType,
    },
    take: limit,
    orderBy: { featured: "desc" },
  });
}

export async function getFeaturedProperties(limit = 6) {
  return prisma.property.findMany({
    where: { status: "PUBLISHED", featured: true },
    take: limit,
    orderBy: { publishedAt: "desc" },
  });
}

export async function getTrendingProperties(limit = 6) {
  return prisma.property.findMany({
    where: { status: "PUBLISHED", trending: true },
    take: limit,
    orderBy: { publishedAt: "desc" },
  });
}
