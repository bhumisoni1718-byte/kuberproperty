import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";
import { getFeaturedProperties } from "@/lib/data/properties";
import { PropertyCard } from "@/components/property/property-card";

export const metadata = buildMetadata({
  title: "Areas in Vadodara",
  description: "Explore premium localities in Vadodara — Alkapuri, Gotri, Manjalpur, Akota & more. Area-wise property listings.",
  path: "/areas",
});

export const revalidate = 3600;

export default async function AreasPage() {
  const areas = await safeDb(
    () => prisma.area.findMany({ orderBy: { name: "asc" } }),
    []
  );

  const featured = await getFeaturedProperties(2);

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: absoluteUrl() },
    { name: "Areas", url: absoluteUrl("/areas") },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <div className="bg-cream min-h-screen">
        <section className="bg-navy py-16 text-white animate-fade-in">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="font-display text-4xl font-bold">Areas in Vadodara</h1>
            <p className="mt-2 text-white/70">Find properties by locality</p>
          </div>
        </section>

        {featured.length > 0 && (
          <section className="container mx-auto px-4 py-12 lg:px-8 animate-fade-in-up">
            <h2 className="font-display text-2xl font-bold text-navy">Featured Properties</h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {featured.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 py-12 lg:px-8 animate-fade-in-up">
          <h2 className="font-display text-2xl font-bold text-navy">Explore Areas</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(areas.length ? areas : [
              { slug: "alkapuri-vadodara", name: "Alkapuri", city: "Vadodara", description: "Premium central locality" },
              { slug: "gotri-vadodara", name: "Gotri", city: "Vadodara", description: "Growing residential hub" },
              { slug: "manjalpur-vadodara", name: "Manjalpur", city: "Vadodara", description: "Family-friendly neighborhood" },
            ]).map((area) => (
              <Link
                key={area.slug}
                href={`/areas/${area.slug}`}
                className="glass-card p-6 transition hover:border-gold/40 hover:-translate-y-1"
              >
                <h2 className="text-xl font-semibold text-navy">{area.name}</h2>
                <p className="text-sm text-gold mt-1">{area.city}</p>
                {"description" in area && area.description && (
                  <p className="mt-3 text-sm text-navy/60">{area.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
