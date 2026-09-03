import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/blog-form";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) notFound();
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Edit Blog</h1>
      <BlogForm blog={blog} />
    </div>
  );
}
