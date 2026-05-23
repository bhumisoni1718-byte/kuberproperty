import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PropertyCard } from "@/components/property/property-card";
import { buildMetadata } from "@/lib/seo";
import { getProperties } from "@/lib/data/properties";

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
  });
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = await prisma.area.findUnique({ where: { slug } });
  if (!area) notFound();

  const { items } = await getProperties({ areaSlug: slug, limit: 12 });

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-navy py-16 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="font-display text-4xl font-bold">Properties in {area.name}</h1>
          <p className="mt-2 text-white/70">{area.city}, {area.state}</p>
          {area.description && <p className="mt-4 max-w-2xl text-white/80">{area.description}</p>}
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 lg:px-8">
        {items.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-navy/50 py-12">No listings in this area yet.</p>
        )}
      </section>
    </div>
  );
}
