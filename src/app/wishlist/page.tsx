"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PropertyCard, type PropertyCardData } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ids.length) {
      setLoading(false);
      return;
    }
    fetch(`/api/properties?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        setProperties(data.properties || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ids]);

  return (
    <div className="bg-cream min-h-screen py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-navy">Your Wishlist</h1>
        <p className="mt-2 text-navy/60">{ids.length} saved properties</p>

        {loading ? (
          <p className="mt-8 text-navy/50">Loading...</p>
        ) : properties.length > 0 ? (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center">
            <p className="text-navy/50">No properties in your wishlist yet.</p>
            <Button variant="gold" className="mt-4" asChild>
              <Link href="/properties">Browse Properties</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
