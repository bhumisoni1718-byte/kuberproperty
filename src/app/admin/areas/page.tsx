import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminAreasPage() {
  const areas = await prisma.area.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Areas</h1>
      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr className="text-left text-navy/60">
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Featured</th>
              <th className="p-4">Link</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-4">{a.name}</td>
                <td className="p-4">{a.slug}</td>
                <td className="p-4">{a.featured ? "Yes" : "No"}</td>
                <td className="p-4">
                  <Link href={`/areas/${a.slug}`} className="text-gold hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
