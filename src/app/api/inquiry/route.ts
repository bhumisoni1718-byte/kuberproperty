import { NextRequest, NextResponse } from "next/server";
import { inquirySchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendLeadEmails } from "@/lib/email";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const limit = rateLimit(`inquiry:${ip}`, 5, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const data = parsed.data;
  let propertyId = data.propertyId;
  let propertyTitle: string | undefined;

  if (!propertyId && data.propertySlug) {
    const property = await prisma.property.findUnique({
      where: { slug: data.propertySlug },
      select: { id: true, title: true },
    });
    propertyId = property?.id;
    propertyTitle = property?.title;
  } else if (propertyId) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { title: true },
    });
    propertyTitle = property?.title;
  }

  await prisma.lead.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      source: data.source,
      propertyId,
      tags: ["property-inquiry"],
    },
  });

  const emailResult = await sendLeadEmails(
    {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message || "",
      source: data.source,
      propertyTitle,
    },
    "Property Inquiry"
  );

  if (!emailResult.success) {
    console.error("[inquiry] Email partial failure:", emailResult);
    return NextResponse.json({
      success: true,
      warning: "Inquiry saved. Email delivery may be delayed — our team will still follow up.",
    });
  }

  return NextResponse.json({ success: true });
}
