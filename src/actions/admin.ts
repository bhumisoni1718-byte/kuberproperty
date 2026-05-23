"use server";

import { revalidatePath } from "next/cache";
import { auth, canEdit, canManageProperties } from "@/auth";
import { prisma } from "@/lib/prisma";
import { propertySchema, blogSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import slugify from "slugify";

async function requireAuth(roles?: ("ADMIN" | "EDITOR" | "AGENT")[]) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (roles && !roles.includes(session.user.role)) throw new Error("Forbidden");
  return session;
}

export async function createProperty(data: unknown) {
  const session = await requireAuth();
  if (!canManageProperties(session.user.role)) throw new Error("Forbidden");

  const parsed = propertySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  // Auto-generate slug from title if not provided
  const slug = parsed.data.slug || slugify(parsed.data.title, { lower: true, strict: true });

  const property = await prisma.property.create({
    data: {
      ...parsed.data,
      slug,
      virtualTourUrl: parsed.data.virtualTourUrl || null,
      createdById: session.user.id,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/properties");
  revalidatePath("/");
  return { success: true, id: property.id };
}

export async function updateProperty(id: string, data: unknown) {
  const session = await requireAuth();
  if (!canManageProperties(session.user.role)) throw new Error("Forbidden");

  const parsed = propertySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  // Auto-generate slug from title if not provided
  const slug = parsed.data.slug || slugify(parsed.data.title, { lower: true, strict: true });

  await prisma.property.update({
    where: { id },
    data: {
      ...parsed.data,
      slug,
      virtualTourUrl: parsed.data.virtualTourUrl || null,
      publishedAt:
        parsed.data.status === "PUBLISHED" ? new Date() : undefined,
    },
  });

  revalidatePath("/properties");
  revalidatePath(`/properties/${slug}`);
  return { success: true };
}

export async function deleteProperty(id: string) {
  const session = await requireAuth();
  if (!canEdit(session.user.role)) throw new Error("Forbidden");
  await prisma.property.delete({ where: { id } });
  revalidatePath("/properties");
  return { success: true };
}

export async function createBlog(data: unknown) {
  const session = await requireAuth();
  if (!canEdit(session.user.role)) throw new Error("Forbidden");

  const parsed = blogSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  // Auto-generate slug from title if not provided
  const slug = parsed.data.slug || slugify(parsed.data.title, { lower: true, strict: true });

  const blog = await prisma.blog.create({
    data: {
      ...parsed.data,
      slug,
      authorId: session.user.id,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  return { success: true, id: blog.id };
}

export async function updateBlog(id: string, data: unknown) {
  const session = await requireAuth();
  if (!canEdit(session.user.role)) throw new Error("Forbidden");

  const parsed = blogSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  // Auto-generate slug from title if not provided
  const slug = parsed.data.slug || slugify(parsed.data.title, { lower: true, strict: true });

  await prisma.blog.update({
    where: { id },
    data: {
      ...parsed.data,
      slug,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : undefined,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  return { success: true };
}

export async function deleteBlog(id: string) {
  const session = await requireAuth();
  if (!canEdit(session.user.role)) throw new Error("Forbidden");
  const blog = await prisma.blog.findUnique({ where: { id }, select: { slug: true } });
  await prisma.blog.delete({ where: { id } });
  revalidatePath("/blog");
  if (blog?.slug) revalidatePath(`/blog/${blog.slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  return { success: true };
}

export async function updateLeadStatus(id: string, status: string, notes?: string) {
  const session = await requireAuth();
  if (!canEdit(session.user.role) && session.user.role !== "AGENT") throw new Error("Forbidden");

  await prisma.lead.update({
    where: { id },
    data: { status: status as "NEW" | "CONTACTED" | "QUALIFIED" | "NEGOTIATION" | "CLOSED" | "LOST", notes },
  });

  revalidatePath("/admin/leads");
  return { success: true };
}

export async function deleteLead(id: string) {
  const session = await requireAuth(["ADMIN"]);
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
  return { success: true };
}

export async function upsertSiteSetting(key: string, value: unknown) {
  const session = await requireAuth(["ADMIN"]);
  await prisma.siteSettings.upsert({
    where: { key },
    create: { key, value: value as object },
    update: { value: value as object },
  });
  revalidatePath("/");
  return { success: true };
}

export async function createFAQ(data: unknown) {
  const session = await requireAuth(["ADMIN", "EDITOR"]);
  const parsed = data as { question: string; answer: string; category: string; order: number };
  await prisma.fAQ.create({
    data: {
      question: parsed.question,
      answer: parsed.answer,
      category: parsed.category,
      order: parsed.order,
      published: true,
    },
  });
  revalidatePath("/");
  return { success: true };
}

export async function updateFAQ(id: string, data: unknown) {
  const session = await requireAuth(["ADMIN", "EDITOR"]);
  const parsed = data as { question: string; answer: string; category: string; order: number };
  await prisma.fAQ.update({
    where: { id },
    data: {
      question: parsed.question,
      answer: parsed.answer,
      category: parsed.category,
      order: parsed.order,
    },
  });
  revalidatePath("/");
  return { success: true };
}

export async function deleteFAQ(id: string) {
  const session = await requireAuth(["ADMIN"]);
  await prisma.fAQ.delete({ where: { id } });
  revalidatePath("/");
  return { success: true };
}

export async function createTeamMember(data: unknown) {
  const session = await requireAuth(["ADMIN"]);
  const parsed = data as { name: string; role: string; bio: string; order: number };
  await prisma.teamMember.create({
    data: parsed,
  });
  revalidatePath("/");
  return { success: true };
}

export async function updateTeamMember(id: string, data: unknown) {
  const session = await requireAuth(["ADMIN"]);
  const parsed = data as { name: string; role: string; bio: string; order: number };
  await prisma.teamMember.update({
    where: { id },
    data: parsed,
  });
  revalidatePath("/");
  return { success: true };
}

export async function deleteTeamMember(id: string) {
  const session = await requireAuth(["ADMIN"]);
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath("/");
  return { success: true };
}

export async function createTestimonial(data: unknown) {
  const session = await requireAuth(["ADMIN", "EDITOR"]);
  const parsed = data as { name: string; role: string; content: string; rating: number; featured: boolean; order: number };
  await prisma.testimonial.create({
    data: parsed,
  });
  revalidatePath("/");
  return { success: true };
}

export async function updateTestimonial(id: string, data: unknown) {
  const session = await requireAuth(["ADMIN", "EDITOR"]);
  const parsed = data as { name: string; role: string; content: string; rating: number; featured: boolean; order: number };
  await prisma.testimonial.update({
    where: { id },
    data: parsed,
  });
  revalidatePath("/");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const session = await requireAuth(["ADMIN"]);
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/");
  return { success: true };
}
