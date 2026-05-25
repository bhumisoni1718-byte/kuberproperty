import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatArea } from "@/lib/utils";

export type PropertyCardData = {
  id: string;
  title: string;
  slug: string;
  price: number;
  city: string;
  propertyType: string;
  listingType?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqFt?: number | null;
  featuredImage?: string | null;
  images: string[];
  featured?: boolean;
};

export function PropertyCard({ property }: { property: PropertyCardData }) {
  const image =
    property.featuredImage ||
    property.images[0] ||
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

  return (
    <article className="group overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm transition hover:shadow-xl">
      <Link href={`/properties/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={property.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {property.featured && (
            <Badge variant="gold" className="absolute left-3 top-3">
              Featured
            </Badge>
          )}
          {property.listingType === "RENT" && (
            <Badge className="absolute right-3 top-3 bg-emerald-600 text-white">
              For Rent
            </Badge>
          )}
          <div className="absolute bottom-3 left-3 rounded-md bg-navy/90 px-3 py-1 text-sm font-semibold text-white">
            {formatPrice(property.price)}
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gold">
            {property.propertyType}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-navy line-clamp-2 group-hover:text-gold transition">
            {property.title}
          </h3>
          <p className="mt-2 flex items-center gap-1 text-sm text-navy/60">
            <MapPin className="h-3.5 w-3.5" />
            {property.city}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-navy/70">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" /> {property.bedrooms} BHK
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="h-4 w-4" /> {property.bathrooms}
              </span>
            )}
            {property.areaSqFt != null && (
              <span className="flex items-center gap-1">
                <Maximize className="h-4 w-4" /> {formatArea(property.areaSqFt)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
