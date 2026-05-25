import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { format } from "date-fns";
import { getBlogBySlug, getRelatedBlogs } from "@/lib/data/blogs";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

// Helper function to convert hyphenated category to display format
function formatCategory(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    path: `/blog/${slug}`,
    image: post.featuredImage || undefined,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedBlogs(post.category, post.id);
  const faqs = (post.faqSection as { question: string; answer: string }[] | null) || [];

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author.name },
    publisher: { "@type": "Organization", name: "Kuber Property" },
  };

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: absoluteUrl() },
    { name: "Blog", url: absoluteUrl("/blog") },
    { name: post.title, url: absoluteUrl(`/blog/${slug}`) },
  ]);

  return (
    <>
      <Script
        id="blog-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <Script
        id="blog-breadcrumb-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {faqs.length > 0 && (
        <Script
          id="blog-faq-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
        />
      )}

      <article className="bg-white">
        {post.featuredImage && (
          <div className="relative h-64 md:h-96">
            <Image src={post.featuredImage} alt={post.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-navy/50" />
          </div>
        )}

        <div className="container mx-auto max-w-3xl px-4 py-12 lg:px-8">
          <nav className="text-sm text-navy/60 mb-6">
            <Link href="/blog">Blog</Link> / <span>{formatCategory(post.category)}</span>
          </nav>
          <span className="text-sm font-medium text-gold">{formatCategory(post.category)}</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-navy md:text-4xl">{post.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-navy/60">
            <span>By {post.author.name}</span>
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {format(post.publishedAt, "MMMM d, yyyy")}
              </time>
            )}
          </div>

          <div
            className="prose-blog mt-10"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold text-navy">FAQ</h2>
              <div className="mt-6 space-y-4">
                {faqs.map((f, i) => (
                  <div key={i} className="glass-card p-5">
                    <h3 className="font-semibold text-navy">{f.question}</h3>
                    <p className="mt-2 text-navy/70">{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-16 border-t pt-12">
              <h2 className="text-xl font-semibold text-navy">Related Articles</h2>
              <ul className="mt-4 space-y-3">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link href={`/blog/${r.slug}`} className="text-gold hover:underline">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
