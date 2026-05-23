import { BlogForm } from "@/components/admin/blog-form";

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">New Blog Post</h1>
      <BlogForm />
    </div>
  );
}
