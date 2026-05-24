import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/property/property-card";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getProperties, getFeaturedProperties } from "@/lib/data/properties";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const area = await prisma.area.findUnique({ where: { slug } });
  if (!area) return {};
  return buildMetadata({
    title: area.seoTitle || `Properties in ${area.name}, Vadodara`,
    description:
      area.seoDescription ||
      `Browse luxury flats & properties in ${area.name}, Vadodara. Premium listings by Kuber Property.`,
    path: `/areas/${slug}`,
    image: area.image || undefined,
  });
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = await prisma.area.findUnique({ where: { slug } });
  if (!area) notFound();

  const [properties, featured] = await Promise.all([
    getProperties({ areaSlug: slug, limit: 12 }),
    getFeaturedProperties(3),
  ]);

  const areaLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: area.name,
    description: area.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: area.city,
      addressRegion: area.state,
    },
  };

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: absoluteUrl() },
    { name: "Areas", url: absoluteUrl("/areas") },
    { name: area.name, url: absoluteUrl(`/areas/${slug}`) },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(areaLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <div className="bg-cream min-h-screen">
        <nav className="container mx-auto px-4 py-4 text-sm text-navy/60 lg:px-8 animate-fade-in">
          <Link href="/">Home</Link> / <Link href="/areas">Areas</Link> /{" "}
          <span className="text-navy">{area.name}</span>
        </nav>

        <section className="bg-navy py-16 text-white animate-fade-in-up">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="font-display text-4xl font-bold">Properties in {area.name}</h1>
            <p className="mt-2 text-white/70">{area.city}, {area.state}</p>
            {area.description && <p className="mt-4 max-w-2xl text-white/80">{area.description}</p>}
          </div>
        </section>

        {featured.length > 0 && (
          <section className="container mx-auto px-4 py-12 lg:px-8 animate-fade-in-up">
            <h2 className="font-display text-2xl font-bold text-navy">Featured Properties</h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 py-12 lg:px-8 animate-fade-in-up">
          <h2 className="font-display text-2xl font-bold text-navy">All Properties in {area.name}</h2>
          {properties.items.length > 0 ? (
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {properties.items.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-center text-navy/50 py-12">No listings in this area yet.</p>
          )}
        </section>
      </div>
    </>
  );
}
