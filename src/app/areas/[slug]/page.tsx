import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/property/property-card";
import { GoogleAreaMap } from "@/components/area/google-area-map";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { parseBoundaryCoordinates } from "@/lib/blog-utils";
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
      `Browse luxury flats and properties in ${area.name}, Vadodara. Premium listings by Kuber Property.`,
    path: `/areas/${slug}`,
    image: area.image || undefined,
  });
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = await prisma.area.findUnique({ where: { slug } });
  if (!area) notFound();

  const areaProperties = await prisma.property.findMany({
    where: { status: "PUBLISHED", areaId: area.id },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take: 12,
  });

  const boundary = parseBoundaryCoordinates(area.boundaryCoordinates);
  const bodyHtml = area.content || area.description;

  const faqs = [
    {
      question: `What types of properties are available in ${area.name}?`,
      answer: `${area.name} offers apartments, villas, penthouses, and commercial spaces. We have listings for both sale and rent to suit different budgets and preferences.`,
    },
    {
      question: `Is ${area.name} a good area to invest in real estate?`,
      answer: `${area.name} is a prime location in Vadodara with excellent connectivity, infrastructure, and amenities. The area has shown consistent appreciation in property values.`,
    },
    {
      question: `What is the average property price in ${area.name}?`,
      answer: `Property prices in ${area.name} vary based on type, size, and location. Contact us for the latest price trends and available listings that match your budget.`,
    },
  ];

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
      <Script
        id="area-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(areaLd) }}
      />
      <Script
        id="area-breadcrumb-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Script
        id="area-faq-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />

      <article className="bg-white">
        {area.image && (
          <div className="relative h-64 md:h-96">
            <Image src={area.image} alt={area.name} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-navy/50" />
          </div>
        )}

        <div className="container mx-auto max-w-3xl px-4 py-12 lg:px-8">
          <nav className="text-sm text-navy/60 mb-6">
            <Link href="/areas">Areas</Link> / <span>{area.name}</span>
          </nav>
          <span className="text-sm font-medium text-gold">Area Guide</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-navy md:text-4xl">
            Properties in {area.name}
          </h1>
          <p className="mt-4 text-navy/60">{area.city}, {area.state}</p>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-navy">Area Map</h2>
            <p className="mt-2 text-sm text-navy/60">
              Explore the {area.name} locality boundary on Google Maps.
            </p>
            <div className="mt-4">
              <GoogleAreaMap areaName={area.name} coordinates={boundary} />
            </div>
          </section>

          {bodyHtml ? (
            <div className="prose-blog mt-10" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          ) : (
            <div className="prose-blog mt-10">
              <h2>About {area.name}</h2>
              <p>
                {area.name} is one of the most sought-after residential and commercial areas in {area.city}, {area.state}.
                This area offers modern infrastructure, excellent connectivity, and a peaceful living environment.
              </p>
              <p>
                Contact Kuber Property today to explore the best property options in {area.name}.
              </p>
            </div>
          )}

          <section className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-semibold text-navy">Featured Properties in {area.name}</h2>
            {areaProperties.length > 0 ? (
              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                {areaProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-xl border border-dashed border-navy/20 bg-cream/50 py-12 text-center text-navy/50">
                No listings yet in this area. Check back soon or{" "}
                <Link href="/contact" className="text-gold hover:underline">contact us</Link> for off-market options.
              </p>
            )}
          </section>

          <section className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-semibold text-navy">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-4">
              {faqs.map((f, i) => (
                <div key={i} className="glass-card p-5">
                  <h3 className="font-semibold text-navy">{f.question}</h3>
                  <p className="mt-2 text-navy/70">{f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
