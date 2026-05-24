"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Trash2 } from "lucide-react";
import type { SavedSearch } from "@prisma/client";

export function SavedSearchesList({ searches }: { searches: SavedSearch[] }) {
  const [items, setItems] = useState(searches);

  async function toggleActive(id: string, active: boolean) {
    try {
      const res = await fetch(`/api/saved-searches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      if (res.ok) {
        setItems(items.map((item) => (item.id === id ? { ...item, active: !active } : item)));
      }
    } catch (error) {
      console.error("Failed to toggle search", error);
    }
  }

  async function deleteSearch(id: string) {
    if (!confirm("Are you sure you want to delete this saved search?")) return;
    
    try {
      const res = await fetch(`/api/saved-searches/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete search", error);
    }
  }

  function formatFilters(filters: any) {
    const parts = [];
    if (filters.city) parts.push(filters.city);
    if (filters.type) parts.push(filters.type);
    if (filters.listingType) parts.push(filters.listingType === "RENT" ? "For Rent" : "For Sale");
    if (filters.bedrooms) parts.push(`${filters.bedrooms} BHK`);
    if (filters.minPrice || filters.maxPrice) {
      const price = [];
      if (filters.minPrice) price.push(`₹${Number(filters.minPrice).toLocaleString()}`);
      if (filters.maxPrice) price.push(`₹${Number(filters.maxPrice).toLocaleString()}`);
      parts.push(price.join(" - "));
    }
    return parts.join(" • ") || "All properties";
  }

  return (
    <div className="space-y-4">
      {items.map((search) => (
        <div
          key={search.id}
          className="glass-card p-6 flex items-start justify-between gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-navy">{search.name}</h3>
              <Badge variant={search.active ? "success" : "outline"}>
                {search.active ? "Active" : "Paused"}
              </Badge>
            </div>
            <p className="text-sm text-navy/60 mt-1">{formatFilters(search.filters)}</p>
            <p className="text-xs text-navy/40 mt-2">
              {search.email} • Last notified:{" "}
              {search.lastNotifiedAt
                ? new Date(search.lastNotifiedAt).toLocaleDateString()
                : "Never"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleActive(search.id, search.active)}
              title={search.active ? "Pause alerts" : "Resume alerts"}
            >
              {search.active ? <Bell className="h-4 w-4 text-gold" /> : <BellOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteSearch(search.id)}
              title="Delete search"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
