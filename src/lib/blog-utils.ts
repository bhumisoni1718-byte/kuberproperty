import { DEFAULT_BLOG_AUTHOR } from "@/lib/constants";

export type BlogDateFields = {
  status: string;
  publishedAt?: Date | null;
  scheduledAt?: Date | null;
};

export type BlogAuthorFields = {
  authorName?: string | null;
  author?: { name?: string | null } | null;
};

/** Whether a blog post should appear on public routes. */
export function isBlogPubliclyVisible(post: BlogDateFields): boolean {
  const now = new Date();
  if (post.status === "PUBLISHED") {
    if (post.publishedAt && post.publishedAt > now) return false;
    return true;
  }
  if (post.status === "SCHEDULED" && post.scheduledAt && post.scheduledAt <= now) {
    return true;
  }
  return false;
}

/** Prisma where clause for publicly visible blog posts. */
export function publicBlogWhere(now = new Date()) {
  return {
    OR: [
      {
        status: "PUBLISHED" as const,
        OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
      },
      {
        status: "SCHEDULED" as const,
        scheduledAt: { lte: now },
      },
    ],
  };
}

/** Display author with fallback for legacy posts missing authorName. */
export function getBlogAuthorName(post: BlogAuthorFields): string {
  const name = post.authorName?.trim() || post.author?.name?.trim();
  return name || DEFAULT_BLOG_AUTHOR;
}

/** Date shown on listing/detail pages (publish date preferred over schedule date). */
export function getBlogDisplayDate(post: BlogDateFields): Date | null {
  if (post.publishedAt) return post.publishedAt;
  if (post.scheduledAt && isBlogPubliclyVisible(post)) return post.scheduledAt;
  return null;
}

/** Admin label for status + upcoming schedule. */
export function getBlogStatusLabel(post: BlogDateFields): string {
  const now = new Date();
  if (post.status === "SCHEDULED" && post.scheduledAt) {
    if (post.scheduledAt > now) return "Scheduled";
    return "Published (was scheduled)";
  }
  if (post.status === "PUBLISHED") return "Published";
  if (post.status === "DRAFT") return "Draft";
  return post.status;
}

export type BoundaryCoordinate = { lat: number; lng: number };

export function parseBoundaryCoordinates(raw: unknown): BoundaryCoordinate[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (p): p is { lat: number; lng: number } =>
        typeof p === "object" &&
        p !== null &&
        typeof (p as BoundaryCoordinate).lat === "number" &&
        typeof (p as BoundaryCoordinate).lng === "number"
    )
    .map((p) => ({ lat: p.lat, lng: p.lng }));
}
