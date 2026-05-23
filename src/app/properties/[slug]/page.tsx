import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { getPropertyBySlug, getSimilarProperties } from "@/lib/data/properties";
import { PropertyCard } from "@/components/property/property-card";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { EMICalculator } from "@/components/property/emi-calculator";
import { buildMetadata, propertyJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { formatPrice, formatArea, absoluteUrl } from "@/lib/utils";
import { CONTACT } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return {};
  return buildMetadata({
    title: property.seoTitle || property.title,
    description: property.seoDescription || property.description.slice(0, 160),
    path: `/properties/${slug}`,
    image: property.featuredImage || property.images[0],
  });
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const similar = await getSimilarProperties(
    property.id,
    property.city,
    property.propertyType
  );

  const images = property.images.length
    ? property.images
    : property.featuredImage
      ? [property.featuredImage]
      : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200"];

  const jsonLd = propertyJsonLd(property);
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: absoluteUrl() },
    { name: "Properties", url: absoluteUrl("/properties") },
    { name: property.title, url: absoluteUrl(`/properties/${slug}`) },
  ]);

  const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    `Hi, I'm interested in: ${property.title}`
  )}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <article className="bg-white">
        <nav className="container mx-auto px-4 py-4 text-sm text-navy/60 lg:px-8">
          <Link href="/">Home</Link> / <Link href="/properties">Properties</Link> /{" "}
          <span className="text-navy">{property.title}</span>
        </nav>

        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {images.slice(0, 5).map((img, i) => (
              <div
                key={img}
                className={`relative overflow-hidden rounded-xl ${i === 0 ? "md:col-span-2 md:row-span-2 aspect-[16/10]" : "aspect-video"}`}
              >
                <Image src={img} alt={`${property.title} - ${i + 1}`} fill className="object-cover" priority={i === 0} />
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Badge variant="gold">{property.propertyType}</Badge>
                  <h1 className="mt-2 font-display text-3xl font-bold text-navy md:text-4xl">
                    {property.title}
                  </h1>
                  <p className="mt-2 flex items-center gap-1 text-navy/60">
                    <MapPin className="h-4 w-4" /> {property.address}, {property.city}
                  </p>
                </div>
                <p className="text-3xl font-bold text-gold">{formatPrice(property.price)}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-6 text-navy/80">
                {property.bedrooms != null && (
                  <span className="flex items-center gap-2"><Bed className="h-5 w-5 text-gold" /> {property.bedrooms} BHK</span>
                )}
                {property.bathrooms != null && (
                  <span className="flex items-center gap-2"><Bath className="h-5 w-5 text-gold" /> {property.bathrooms} Bath</span>
                )}
                {property.areaSqFt != null && (
                  <span className="flex items-center gap-2"><Maximize className="h-5 w-5 text-gold" /> {formatArea(property.areaSqFt)}</span>
                )}
              </div>

              <div className="mt-8 prose max-w-none text-navy/80">
                <h2 className="text-xl font-semibold text-navy">Description</h2>
                <p className="mt-2 whitespace-pre-line leading-relaxed">{property.description}</p>
              </div>

              {property.amenities.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-navy">Amenities</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.amenities.map((a) => (
                      <Badge key={a} variant="outline">{a}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {property.virtualTourUrl && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-navy">Virtual Tour</h2>
                  <a
                    href={property.virtualTourUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-gold hover:underline"
                  >
                    View Virtual Tour →
                  </a>
                </div>
              )}

              <div className="mt-10">
                <EMICalculator defaultAmount={property.price * 0.8} />
              </div>

              {property.latitude && property.longitude && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold text-navy mb-4">Location</h2>
                  <iframe
                    title="Property location"
                    className="w-full h-80 rounded-xl border"
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
                  />
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <div className="glass-card p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-navy">Schedule a Visit</h2>
                <InquiryForm
                  propertyId={property.id}
                  propertySlug={property.slug}
                  propertyTitle={property.title}
                />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="gold" asChild className="w-full">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={`tel:${CONTACT.phone}`}>Call Now</a>
                  </Button>
                </div>
              </div>

              {property.createdBy && (
                <div className="glass-card p-6">
                  <h3 className="font-semibold text-navy">Your Agent</h3>
                  <p className="mt-2 text-navy font-medium">{property.createdBy.name}</p>
                  {property.createdBy.phone && (
                    <a href={`tel:${property.createdBy.phone}`} className="text-sm text-gold">
                      {property.createdBy.phone}
                    </a>
                  )}
                </div>
              )}
            </aside>
          </div>

          {similar.length > 0 && (
            <section className="mt-16 pb-16">
              <h2 className="font-display text-2xl font-bold text-navy">Similar Properties</h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {similar.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
