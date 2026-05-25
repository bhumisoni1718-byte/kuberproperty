"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { blogSchema } from "@/lib/validations";
import { createBlog, updateBlog } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BLOG_CATEGORIES } from "@/lib/constants";
import type { Blog } from "@prisma/client";

// Helper function to convert hyphenated category to display format
function formatCategory(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Character counter component
function CharacterCounter({ value, maxLength }: { value: string; maxLength: number }) {
  const count = value?.length || 0;
  const isOverLimit = count > maxLength;
  return (
    <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-navy/50'}`}>
      {count}/{maxLength}
    </span>
  );
}

export function BlogForm({ blog }: { blog?: Blog }) {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: blog
      ? {
          title: blog.title,
          slug: blog.slug,
          content: blog.content,
          excerpt: blog.excerpt ?? undefined,
          featuredImage: blog.featuredImage ?? undefined,
          seoTitle: blog.seoTitle ?? undefined,
          seoDescription: blog.seoDescription ?? undefined,
          category: blog.category,
          tags: blog.tags,
          status: blog.status,
        }
      : { status: "DRAFT", tags: [], category: BLOG_CATEGORIES[0] },
  });

  const seoTitle = watch("seoTitle") || "";
  const seoDescription = watch("seoDescription") || "";

  async function onSubmit(data: z.infer<typeof blogSchema>) {
    const result = blog ? await updateBlog(blog.id, data) : await createBlog(data);
    if ("error" in result && result.error) {
      toast.error("Validation failed");
      return;
    }
    toast.success(blog ? "Updated" : "Created");
    router.push("/admin/blogs");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-4 bg-white rounded-xl border p-6">
      <div>
        <Label>Title</Label>
        <Input {...register("title")} className="mt-1" />
      </div>
      <div>
        <Label>Slug</Label>
        <Input {...register("slug")} className="mt-1" />
      </div>
      <div>
        <Label>Category</Label>
        <select {...register("category")} className="mt-1 w-full h-10 rounded-md border px-3 text-sm">
          {BLOG_CATEGORIES.map((c) => (
            <option key={c} value={c}>{formatCategory(c)}</option>
          ))}
        </select>
      </div>
      <div>
        <Label>Excerpt</Label>
        <Textarea {...register("excerpt")} className="mt-1" rows={3} />
      </div>
      <div>
        <Label>Content (HTML)</Label>
        <Textarea rows={12} {...register("content")} className="mt-1 font-mono text-sm" />
      </div>
      <div>
        <Label>Featured Image URL</Label>
        <Input {...register("featuredImage")} className="mt-1" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label>SEO Title</Label>
          <CharacterCounter value={seoTitle} maxLength={60} />
        </div>
        <Input {...register("seoTitle")} className="mt-1" placeholder="Optional: Custom title for search engines (max 60 chars)" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label>SEO Description</Label>
          <CharacterCounter value={seoDescription} maxLength={160} />
        </div>
        <Textarea {...register("seoDescription")} className="mt-1" rows={3} placeholder="Optional: Custom description for search engines (max 160 chars)" />
      </div>
      <div>
        <Label>Status</Label>
        <select {...register("status")} className="mt-1 w-full h-10 rounded-md border px-3 text-sm">
          {["DRAFT", "PUBLISHED", "SCHEDULED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <Button type="submit" variant="gold" disabled={isSubmitting}>Save</Button>
    </form>
  );
}
