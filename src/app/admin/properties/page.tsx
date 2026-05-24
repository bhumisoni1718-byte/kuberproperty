import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Plus, Star } from "lucide-react";
import { toggleFeaturedProperty } from "@/actions/admin";
import { revalidatePath } from "next/cache";

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { updatedAt: "desc" },
    include: { createdBy: { select: { name: true } } },
  });

  async function handleToggleFeatured(id: string, currentFeatured: boolean) {
    "use server";
    await toggleFeaturedProperty(id, !currentFeatured);
    revalidatePath("/admin/properties");
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Properties</h1>
        <Button variant="gold" asChild>
          <Link href="/admin/properties/new">
            <Plus className="h-4 w-4" /> Add Property
          </Link>
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr className="text-left text-navy/60">
              <th className="p-4">Title</th>
              <th className="p-4">Price</th>
              <th className="p-4">City</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Featured</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-t border-navy/5">
                <td className="p-4 font-medium text-navy">{p.title}</td>
                <td className="p-4">{formatPrice(p.price)}</td>
                <td className="p-4">{p.city}</td>
                <td className="p-4">
                  <span className="text-xs">
                    {p.listingType === "RENT" ? (
                      <Badge className="bg-emerald-600 text-white">Rent</Badge>
                    ) : (
                      <Badge variant="outline">Sale</Badge>
                    )}
                  </span>
                </td>
                <td className="p-4">
                  <Badge variant={p.status === "PUBLISHED" ? "success" : "outline"}>
                    {p.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <form action={handleToggleFeatured.bind(null, p.id, p.featured)}>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className={p.featured ? "text-gold" : "text-navy/40 hover:text-gold"}
                    >
                      <Star className={`h-4 w-4 ${p.featured ? "fill-current" : ""}`} />
                    </Button>
                  </form>
                </td>
                <td className="p-4">
                  <Link href={`/admin/properties/${p.id}`} className="text-gold hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
