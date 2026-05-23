import { Suspense } from "react";
import Link from "next/link";
import { PropertyCard } from "@/components/property/property-card";
import { PropertySearch } from "@/components/property/property-search";
import { getProperties } from "@/lib/data/properties";
import { safeDb } from "@/lib/safe-db";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Properties for Sale in Vadodara",
  description:
    "Browse luxury flats, 2 BHK & 3 BHK apartments, villas & commercial property in Vadodara. Advanced filters, verified listings by Kuber Property.",
  path: "/properties",
  keywords: ["Properties Vadodara", "2 BHK Flats Vadodara", "Luxury Apartments Gujarat"],
});

export const revalidate = 300;

type SearchParams = Promise<Record<string, string | undefined>>;

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { items, total, pages } = await safeDb(
    () =>
      getProperties({
    q: params.q,
    city: params.city,
    type: params.type,
    bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    sort: params.sort,
    page,
    limit: 12,
      }),
    { items: [], total: 0, pages: 0, page: 1 }
  );

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-navy py-16 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="font-display text-4xl font-bold">Properties in Vadodara</h1>
          <p className="mt-2 text-white/70">{total} listings available</p>
          <div className="mt-8">
            <Suspense>
              <PropertySearch />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-navy/60 text-sm">
            Showing {items.length} of {total} properties
          </p>
          <div className="flex gap-2">
            {["newest", "price-asc", "price-desc", "area"].map((s) => (
              <Link
                key={s}
                href={`/properties?${new URLSearchParams({ ...params, sort: s } as Record<string, string>).toString()}`}
                className={`rounded-md px-3 py-1 text-sm ${
                  params.sort === s ? "bg-gold text-navy font-medium" : "bg-white text-navy/70"
                }`}
              >
                {s.replace("-", " ")}
              </Link>
            ))}
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-navy/50">
            <p>No properties match your filters.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/properties">Clear Filters</Link>
            </Button>
          </div>
        )}

        {pages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/properties?${new URLSearchParams({ ...params, page: String(p) } as Record<string, string>).toString()}`}
                className={`rounded-md px-4 py-2 text-sm ${
                  p === page ? "bg-navy text-white" : "bg-white text-navy"
                }`}
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
