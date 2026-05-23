import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { updatedAt: "desc" },
    include: { createdBy: { select: { name: true } } },
  });

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
                  <Badge variant={p.status === "PUBLISHED" ? "success" : "outline"}>
                    {p.status}
                  </Badge>
                </td>
                <td className="p-4">{p.featured ? "Yes" : "—"}</td>
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
