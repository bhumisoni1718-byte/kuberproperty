"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROPERTY_TYPES, BHK_OPTIONS } from "@/lib/constants";

export function PropertySearch({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [city, setCity] = useState(params.get("city") || "Vadodara");
  const [type, setType] = useState(params.get("type") || "");
  const [listingType, setListingType] = useState(params.get("listingType") || "");
  const [bedrooms, setBedrooms] = useState(params.get("bedrooms") || "");
  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "");
  const [q, setQ] = useState(params.get("q") || "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (city) search.set("city", city);
    if (type) search.set("type", type);
    if (listingType) search.set("listingType", listingType);
    if (bedrooms) search.set("bedrooms", bedrooms);
    if (minPrice) search.set("minPrice", minPrice);
    if (maxPrice) search.set("maxPrice", maxPrice);
    router.push(`/properties?${search.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className={`rounded-2xl border border-white/30 bg-white/90 p-4 shadow-2xl backdrop-blur-md ${
        compact ? "" : "lg:p-6"
      }`}
    >
      <div className={`grid gap-3 ${compact ? "grid-cols-1 sm:grid-cols-2" : "lg:grid-cols-6"}`}>
        <Input
          placeholder="Search location, project..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className={compact ? "" : "lg:col-span-2"}
        />
        <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-10 rounded-md border border-navy/15 px-3 text-sm text-navy"
        >
          <option value="">Property Type</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
          className="h-10 rounded-md border border-navy/15 px-3 text-sm text-navy"
        >
          <option value="">Listing Type</option>
          <option value="SALE">For Sale</option>
          <option value="RENT">For Rent</option>
        </select>
        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="h-10 rounded-md border border-navy/15 px-3 text-sm text-navy"
        >
          <option value="">BHK</option>
          {BHK_OPTIONS.map((b) => (
            <option key={b} value={b}>
              {b} BHK
            </option>
          ))}
        </select>
        {!compact && (
          <>
            <Input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </>
        )}
      </div>
      <Button type="submit" variant="gold" className="mt-4 w-full sm:w-auto" size="lg">
        <Search className="h-4 w-4" />
        Search Properties
      </Button>
    </form>
  );
}
