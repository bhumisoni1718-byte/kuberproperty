import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowRight, Award, Shield, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/property/property-card";
import { PropertySearch } from "@/components/property/property-search";
import { ContactForm } from "@/components/forms/contact-form";
import { getFeaturedProperties, getTrendingProperties } from "@/lib/data/properties";
import { getBlogs } from "@/lib/data/blogs";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { SITE_NAME, LOCAL_SEO_KEYWORDS } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Luxury Real Estate in Vadodara",
  description:
    "Kuber Property — Premium property dealer in Vadodara. Luxury flats, 2 BHK & 3 BHK apartments, commercial property & real estate consultant in Gujarat.",
  path: "/",
  keywords: LOCAL_SEO_KEYWORDS,
});

export const revalidate = 3600;

async function HomeContent() {
  const [featured, trending, testimonials, faqs, areas, blogs, stats] = await safeDb(
    () =>
      Promise.all([
        getFeaturedProperties(6),
        getTrendingProperties(4),
        prisma.testimonial.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 4 }),
        prisma.fAQ.findMany({ where: { published: true }, orderBy: { order: "asc" }, take: 6 }),
        prisma.area.findMany({ where: { featured: true }, take: 6 }),
        getBlogs({ limit: 3 }),
        Promise.all([
          prisma.property.count({ where: { status: "PUBLISHED" } }),
          prisma.lead.count(),
          prisma.area.count(),
        ]),
      ]),
    [[], [], [], [], [], { items: [], total: 0, pages: 0, page: 1 }, [0, 0, 0]] as [
      Awaited<ReturnType<typeof getFeaturedProperties>>,
      Awaited<ReturnType<typeof getTrendingProperties>>,
      Awaited<ReturnType<typeof prisma.testimonial.findMany>>,
      Awaited<ReturnType<typeof prisma.fAQ.findMany>>,
      Awaited<ReturnType<typeof prisma.area.findMany>>,
      Awaited<ReturnType<typeof getBlogs>>,
      [number, number, number],
    ]
  );

  const [propertyCount, leadCount, areaCount] = stats;
  const faqLd = faqs.length ? faqJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer }))) : null;

  return (
    <>
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80"
          alt="Beautiful bungalow with family in garden"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Decorative overlay elements */}
        <div className="absolute top-20 right-10 hidden lg:block">
          <div className="glass-card p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center">
                <Award className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-white font-semibold">15+ Years</p>
                <p className="text-white/70 text-sm">Trusted Service</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-32 left-10 hidden lg:block">
          <div className="glass-card p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-white font-semibold">500+ Happy</p>
                <p className="text-white/70 text-sm">Families Served</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/3 right-1/4 hidden lg:block">
          <div className="glass-card p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-white font-semibold">100%</p>
                <p className="text-white/70 text-sm">Verified Properties</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4 py-24 lg:px-8">
          <p className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">
            Vadodara&apos;s Premier Realty
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Discover Luxury Living with {SITE_NAME}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">
            Premium flats, villas & commercial spaces. Trusted real estate consultant
            serving Vadodara & Gujarat since day one.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="gold" size="lg" asChild>
              <Link href="/properties">Explore Properties</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-gold text-gold hover:bg-gold/10" asChild>
              <Link href="/contact">Book Consultation</Link>
            </Button>
          </div>
          <div className="mt-12 max-w-4xl">
            <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-white/20" />}>
              <PropertySearch compact />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy py-12">
        <div className="container mx-auto grid grid-cols-2 gap-8 px-4 text-center md:grid-cols-4 lg:px-8">
          {[
            { label: "Properties Listed", value: `${propertyCount}+` },
            { label: "Happy Clients", value: `${leadCount}+` },
            { label: "Areas Covered", value: `${areaCount}+` },
            { label: "Years Experience", value: "15+" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-gold lg:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
                Featured Properties
              </h2>
              <p className="mt-2 text-navy/60">Handpicked luxury listings in Vadodara</p>
            </div>
            <Link href="/properties" className="hidden items-center gap-1 text-gold font-medium sm:flex hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {(featured.length ? featured : []).map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          {featured.length === 0 && (
            <p className="text-center text-navy/50 py-12">Properties coming soon. Run seed script to populate.</p>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-navy text-center">Browse by Category</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Apartment", "Villa", "Commercial", "Penthouse"].map((cat) => (
              <Link
                key={cat}
                href={`/properties?type=${cat}`}
                className="glass-card p-6 text-center transition hover:border-gold/50 hover:shadow-xl"
              >
                <h3 className="text-lg font-semibold text-navy">{cat}</h3>
                <p className="mt-2 text-sm text-navy/60">Explore {cat.toLowerCase()}s</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Locations */}
      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-center">Trending Locations</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(areas.length ? areas : [{ name: "Alkapuri", slug: "alkapuri-vadodara", city: "Vadodara" }]).map(
              (area) => (
                <Link
                  key={area.slug}
                  href={`/areas/${area.slug}`}
                  className="rounded-xl border border-white/10 p-6 transition hover:border-gold/50"
                >
                  <h3 className="text-xl font-semibold text-gold">{area.name}</h3>
                  <p className="mt-2 text-sm text-white/70">{area.city} — Premium locality</p>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-navy text-center">
            Why Choose {SITE_NAME}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: "Trusted Advisory", desc: "Transparent deals with verified documentation" },
              { icon: Award, title: "Premium Portfolio", desc: "Curated luxury & investment-grade properties" },
              { icon: Users, title: "Expert Agents", desc: "Dedicated consultants for every budget" },
              { icon: TrendingUp, title: "Market Insights", desc: "Data-driven guidance for smart investments" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card p-6 text-center">
                <Icon className="mx-auto h-10 w-10 text-gold" />
                <h3 className="mt-4 font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-sm text-navy/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-cream">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="font-display text-3xl font-bold text-navy text-center">Client Stories</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {testimonials.map((t) => (
                <blockquote key={t.id} className="glass-card p-6">
                  <p className="text-navy/80 italic">&ldquo;{t.content}&rdquo;</p>
                  <footer className="mt-4 font-semibold text-navy">
                    — {t.name}
                    {t.role && <span className="text-navy/50 font-normal">, {t.role}</span>}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto max-w-3xl px-4 lg:px-8">
            <h2 className="font-display text-3xl font-bold text-navy text-center">Frequently Asked Questions</h2>
            <div className="mt-10 space-y-4">
              {faqs.map((f) => (
                <details key={f.id} className="glass-card p-5 group">
                  <summary className="cursor-pointer font-semibold text-navy list-none flex justify-between">
                    {f.question}
                  </summary>
                  <p className="mt-3 text-navy/70 text-sm leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-navy">Latest Insights</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {blogs.items.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="glass-card overflow-hidden group">
                {post.featuredImage && (
                  <div className="relative aspect-video">
                    <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <span className="text-xs text-gold font-medium">{post.category}</span>
                  <h3 className="mt-2 font-semibold text-navy group-hover:text-gold transition line-clamp-2">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/blog">Read All Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <div className="text-white">
            <h2 className="font-display text-3xl font-bold">Ready to Find Your Dream Home?</h2>
            <p className="mt-4 text-white/70">
              Schedule a free consultation with our Vadodara real estate experts today.
            </p>
          </div>
          <div className="glass-card p-6 bg-white">
            <ContactForm source="homepage-cta" />
          </div>
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
