import Link from "next/link";
import Image from "next/image";
import { getBlogs } from "@/lib/data/blogs";
import { safeDb } from "@/lib/safe-db";
import { buildMetadata } from "@/lib/seo";
import { BLOG_CATEGORIES } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Real Estate Blog & Insights",
  description:
    "Expert guides on home buying, investment tips, luxury properties & market trends in Vadodara and Gujarat.",
  path: "/blog",
});

export const revalidate = 3600;

type SearchParams = Promise<{ category?: string; q?: string; page?: string }>;

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { items, total, pages } = await safeDb(
    () => getBlogs({ category: params.category, q: params.q, page }),
    { items: [], total: 0, pages: 0, page: 1 }
  );

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-navy py-16 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="font-display text-4xl font-bold">Real Estate Insights</h1>
          <p className="mt-2 text-white/70">{total} articles</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`rounded-full px-4 py-1 text-sm ${!params.category ? "bg-gold text-navy" : "bg-white/10 text-white"}`}
            >
              All
            </Link>
            {BLOG_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/blog?category=${encodeURIComponent(cat)}`}
                className={`rounded-full px-4 py-1 text-sm ${
                  params.category === cat ? "bg-gold text-navy" : "bg-white/10 text-white"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <article key={post.id} className="glass-card overflow-hidden group">
              <Link href={`/blog/${post.slug}`}>
                <div className="relative aspect-video bg-navy/5">
                  {post.featuredImage ? (
                    <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
                  ) : null}
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-gold">{post.category}</span>
                  <h2 className="mt-2 text-lg font-semibold text-navy group-hover:text-gold transition line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-navy/60 line-clamp-3">{post.excerpt}</p>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>

        {pages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/blog?page=${p}${params.category ? `&category=${encodeURIComponent(params.category)}` : ""}`}
                className={`rounded-md px-4 py-2 text-sm ${p === page ? "bg-navy text-white" : "bg-white"}`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
