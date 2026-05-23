"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { inquirySchema, type InquiryInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function InquiryForm({
  propertyId,
  propertySlug,
  propertyTitle,
}: {
  propertyId?: string;
  propertySlug?: string;
  propertyTitle?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      source: "property-inquiry",
      propertyId,
      propertySlug,
      message: propertyTitle ? `Interested in: ${propertyTitle}` : "",
    },
  });

  async function onSubmit(data: InquiryInput) {
    const res = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.error || "Failed to submit");
      return;
    }
    toast.success("Inquiry sent! Our agent will call you shortly.");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input type="hidden" {...register("propertyId")} />
      <input type="hidden" {...register("propertySlug")} />
      <input type="hidden" {...register("source")} />
      <div>
        <Label htmlFor="inq-name">Name</Label>
        <Input id="inq-name" {...register("name")} className="mt-1" />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="inq-email">Email</Label>
        <Input id="inq-email" type="email" {...register("email")} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="inq-phone">Phone</Label>
        <Input id="inq-phone" {...register("phone")} className="mt-1" />
        {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
      </div>
      <div>
        <Label htmlFor="inq-message">Message</Label>
        <Textarea id="inq-message" rows={3} {...register("message")} className="mt-1" />
      </div>
      <Button type="submit" variant="gold" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Request Callback"}
      </Button>
    </form>
  );
}
