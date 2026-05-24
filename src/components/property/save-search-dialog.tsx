"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SaveSearchDialogProps {
  filters: {
    city?: string;
    type?: string;
    listingType?: string;
    bedrooms?: string;
    minPrice?: string;
    maxPrice?: string;
  };
  onClose: () => void;
}

export function SaveSearchDialog({ filters, onClose }: SaveSearchDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function formatFilterDescription() {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          filters,
        }),
      });

      if (res.ok) {
        toast.success("Search saved! You'll receive email alerts for new matching properties.");
        onClose();
      } else {
        toast.error("Failed to save search");
      }
    } catch (error) {
      toast.error("Failed to save search");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Search Alert</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label>Search Criteria</Label>
            <p className="text-sm text-navy/60 mt-1">{formatFilterDescription()}</p>
          </div>
          <div>
            <Label htmlFor="name">Alert Name</Label>
            <Input
              id="name"
              placeholder="e.g., 3BHK in Alkapuri under 50L"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-navy/50 mt-1">
              We'll email you when new properties match your criteria
            </p>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="gold" disabled={loading} className="flex-1">
              {loading ? "Saving..." : "Save Alert"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
