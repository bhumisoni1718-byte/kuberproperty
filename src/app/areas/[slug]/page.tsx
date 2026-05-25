import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/property/property-card";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
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

  const properties = await getProperties({ areaSlug: slug, limit: 12 });

  const featured = await getFeaturedProperties(2);

  const faqs = [
    {
      question: `What types of properties are available in ${area.name}?`,
      answer: `${area.name} offers a variety of properties including apartments, villas, penthouses, and commercial spaces. We have listings for both sale and rent to suit different budgets and preferences.`,
    },
    {
      question: `Is ${area.name} a good area to invest in real estate?`,
      answer: `${area.name} is a prime location in Vadodara with excellent connectivity, infrastructure, and amenities. The area has shown consistent appreciation in property values, making it a good investment choice.`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(areaLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }} />

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
          <h1 className="mt-2 font-display text-3xl font-bold text-navy md:text-4xl">Properties in {area.name}</h1>
          <p className="mt-4 text-navy/60">{area.city}, {area.state}</p>

          {area.description ? (
            <div
              className="prose-blog mt-10"
              dangerouslySetInnerHTML={{ __html: area.description }}
            />
          ) : (
            <div className="prose-blog mt-10">
              <p>
                {area.name} is one of the most sought-after residential and commercial areas in {area.city}, {area.state}.
                This area offers a perfect blend of modern infrastructure, excellent connectivity, and peaceful living environment.
                With well-planned roads, reliable public transportation, and proximity to essential amenities, {area.name} has become a preferred choice for homebuyers and investors alike.
              </p>
              <p>
                The area boasts a wide range of properties including apartments, villas, penthouses, and commercial spaces.
                Whether you're looking for a cozy 2 BHK apartment or a luxurious 4 BHK villa, {area.name} has options to suit every budget and preference.
                The real estate market in this area has shown consistent growth over the years, making it an attractive destination for property investment.
              </p>
              <p>
                Residents of {area.name} enjoy easy access to reputed schools, hospitals, shopping malls, restaurants, and entertainment centers.
                The area is well-connected to other parts of {area.city} through major roads and public transport networks.
                With ongoing infrastructure development and planned civic amenities, {area.name} is poised for further growth in the coming years.
              </p>
              <p>
                Investing in property in {area.name} offers excellent potential for appreciation and rental income.
                The area's strategic location, combined with its growing popularity, makes it a smart choice for both end-users and investors.
                Contact Kuber Property today to explore the best property options in {area.name} and make your dream of owning a home a reality.
              </p>
            </div>
          )}

          {featured.length > 0 && (
            <section className="mt-16 border-t pt-12">
              <h2 className="text-2xl font-semibold text-navy">Featured Properties in {area.name}</h2>
              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                {featured.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </section>
          )}

          <section className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-semibold text-navy">All Properties in {area.name}</h2>
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
