import { prisma } from "@/lib/prisma";
import { publicBlogWhere } from "@/lib/blog-utils";

export async function getBlogs({
  category,
  q,
  page = 1,
  limit = 9,
}: {
  category?: string;
  q?: string;
  page?: number;
  limit?: number;
} = {}) {
  const where: Record<string, unknown> = { ...publicBlogWhere() };
  if (category) where.category = category;
  if (q) {
    where.AND = [
      {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { scheduledAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: { author: { select: { name: true, image: true } } },
    }),
    prisma.blog.count({ where }),
  ]);

  return { items, total, pages: Math.ceil(total / limit), page };
}

export async function getBlogBySlug(slug: string) {
  return prisma.blog.findFirst({
    where: { slug, ...publicBlogWhere() },
    include: { author: { select: { name: true, image: true, bio: true } } },
  });
}

export async function getRelatedBlogs(category: string, excludeId: string, limit = 3) {
  return prisma.blog.findMany({
    where: { category, ...publicBlogWhere(), id: { not: excludeId } },
    take: limit,
    orderBy: [{ publishedAt: "desc" }, { scheduledAt: "desc" }],
  });
}
