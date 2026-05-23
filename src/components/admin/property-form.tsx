"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { propertySchema } from "@/lib/validations";
import { createProperty, updateProperty } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PROPERTY_TYPES, POSSESSION_OPTIONS } from "@/lib/constants";
import type { Property } from "@prisma/client";

export function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(property?.images || []);

  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          title: property.title,
          slug: property.slug,
          description: property.description,
          price: property.price,
          propertyType: property.propertyType,
          bedrooms: property.bedrooms ?? undefined,
          bathrooms: property.bathrooms ?? undefined,
          areaSqFt: property.areaSqFt ?? undefined,
          amenities: property.amenities,
          address: property.address,
          city: property.city,
          state: property.state,
          pincode: property.pincode ?? undefined,
          latitude: property.latitude ?? undefined,
          longitude: property.longitude ?? undefined,
          images: property.images,
          featuredImage: property.featuredImage ?? undefined,
          videos: property.videos,
          virtualTourUrl: property.virtualTourUrl || "",
          floorPlans: property.floorPlans,
          possession: property.possession ?? undefined,
          builder: property.builder ?? undefined,
          seoTitle: property.seoTitle ?? undefined,
          seoDescription: property.seoDescription ?? undefined,
          featured: property.featured,
          trending: property.trending,
          status: property.status,
          categoryId: property.categoryId ?? undefined,
          areaId: property.areaId ?? undefined,
        }
      : {
          status: "DRAFT",
          amenities: [],
          images: [],
          videos: [],
          floorPlans: [],
          city: "Vadodara",
          state: "Gujarat",
        },
  });

  function handleImageUrlChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const urls = e.target.value
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);
    setImages(urls);
  }

  async function onSubmit(data: z.infer<typeof propertySchema>) {
    const payload = { ...data, images, featuredImage: images[0] || data.featuredImage };
    const result = property
      ? await updateProperty(property.id, payload)
      : await createProperty(payload);

    if ("error" in result && result.error) {
      toast.error("Validation failed");
      return;
    }
    toast.success(property ? "Property updated" : "Property created");
    router.push("/admin/properties");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6 bg-white rounded-xl border p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Title</Label>
          <Input {...register("title")} className="mt-1" />
        </div>
        <div>
          <Label>Slug</Label>
          <Input {...register("slug")} className="mt-1" />
        </div>
        <div>
          <Label>Price (INR)</Label>
          <Input type="number" {...register("price")} className="mt-1" />
        </div>
        <div>
          <Label>Property Type</Label>
          <select {...register("propertyType")} className="mt-1 w-full h-10 rounded-md border px-3 text-sm">
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Status</Label>
          <select {...register("status")} className="mt-1 w-full h-10 rounded-md border px-3 text-sm">
            {["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Bedrooms</Label>
          <Input type="number" {...register("bedrooms")} className="mt-1" />
        </div>
        <div>
          <Label>Bathrooms</Label>
          <Input type="number" {...register("bathrooms")} className="mt-1" />
        </div>
        <div>
          <Label>Area (sq.ft)</Label>
          <Input type="number" {...register("areaSqFt")} className="mt-1" />
        </div>
        <div>
          <Label>Possession</Label>
          <select {...register("possession")} className="mt-1 w-full h-10 rounded-md border px-3 text-sm">
            <option value="">Select</option>
            {POSSESSION_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label>Description</Label>
          <Textarea rows={6} {...register("description")} className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label>Address</Label>
          <Input {...register("address")} className="mt-1" />
        </div>
        <div>
          <Label>City</Label>
          <Input {...register("city")} className="mt-1" />
        </div>
        <div>
          <Label>State</Label>
          <Input {...register("state")} className="mt-1" />
        </div>
        <div>
          <Label>Pincode</Label>
          <Input type="text" {...register("pincode")} className="mt-1" />
        </div>
        <div>
          <Label>Latitude</Label>
          <Input type="number" step="any" {...register("latitude")} className="mt-1" />
        </div>
        <div>
          <Label>Longitude</Label>
          <Input type="number" step="any" {...register("longitude")} className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label>Amenities (comma separated)</Label>
          <Input
            defaultValue={property?.amenities?.join(", ") || ""}
            onChange={(e) =>
              setValue(
                "amenities",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
            className="mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Image URLs (one per line)</Label>
          <Textarea
            rows={4}
            placeholder="https://res.cloudinary.com/your-cloud-name/image/upload/v123/property1.jpg&#10;https://res.cloudinary.com/your-cloud-name/image/upload/v123/property2.jpg"
            defaultValue={images.join("\n")}
            onChange={handleImageUrlChange}
            className="mt-1"
          />
          <p className="text-sm text-navy/50 mt-1">Upload images to Cloudinary, then paste URLs here (one per line)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((img) => (
              <img key={img} src={img} alt="" className="h-16 w-16 rounded object-cover" />
            ))}
          </div>
        </div>
        <div>
          <Label>SEO Title</Label>
          <Input {...register("seoTitle")} className="mt-1" />
        </div>
        <div>
          <Label>Virtual Tour URL</Label>
          <Input {...register("virtualTourUrl")} className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <Label>SEO Description</Label>
          <Textarea rows={2} {...register("seoDescription")} className="mt-1" />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("featured")} />
          <span className="text-sm">Featured Property</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("trending")} />
          <span className="text-sm">Trending</span>
        </label>
      </div>
      <Button type="submit" variant="gold" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : property ? "Update Property" : "Create Property"}
      </Button>
    </form>
  );
}
