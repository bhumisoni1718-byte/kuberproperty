import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendLeadEmails } from "@/lib/email";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const limit = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  await prisma.lead.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      source: data.source,
      tags: ["contact"],
    },
  });

  const emailResult = await sendLeadEmails(
    {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      source: data.source,
    },
    "New Contact"
  );

  if (!emailResult.success) {
    console.error("[contact] Email partial failure:", emailResult);
    return NextResponse.json({
      success: true,
      warning: "Lead saved. Email delivery may be delayed — our team will still follow up.",
    });
  }

  return NextResponse.json({ success: true });
}
