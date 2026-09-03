import { PropertyForm } from "@/components/admin/property-form";
import { prisma } from "@/lib/prisma";

export default async function NewPropertyPage() {
  const areas = await prisma.area.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, categoryId: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Add Property</h1>
      <PropertyForm areas={areas} />
    </div>
  );
}
