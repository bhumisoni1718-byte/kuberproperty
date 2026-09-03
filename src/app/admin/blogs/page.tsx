import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBlogAuthorName, getBlogStatusLabel } from "@/lib/blog-utils";
import { Plus } from "lucide-react";

function formatCategory(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function statusBadgeVariant(status: string, scheduledAt?: Date | null): "default" | "outline" | "secondary" {
  if (status === "PUBLISHED") return "default";
  if (status === "SCHEDULED" && scheduledAt && scheduledAt > new Date()) return "secondary";
  return "outline";
}

export default async function AdminBlogsPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Blog Posts</h1>
        <Button variant="gold" asChild>
          <Link href="/admin/blogs/new"><Plus className="h-4 w-4" /> New Post</Link>
        </Button>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-navy/5">
            <tr className="text-left text-navy/60">
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Author</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((b) => {
              const label = getBlogStatusLabel(b);
              const date = b.publishedAt ?? b.scheduledAt;
              return (
                <tr key={b.id} className="border-t">
                  <td className="p-4 font-medium">{b.title}</td>
                  <td className="p-4">{formatCategory(b.category)}</td>
                  <td className="p-4">
                    <Badge variant={statusBadgeVariant(b.status, b.scheduledAt)}>{label}</Badge>
                  </td>
                  <td className="p-4 text-navy/70">
                    {date ? format(date, "MMM d, yyyy h:mm a") : "—"}
                  </td>
                  <td className="p-4">{getBlogAuthorName(b)}</td>
                  <td className="p-4">
                    <Link href={`/admin/blogs/${b.id}`} className="text-gold hover:underline">Edit</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
