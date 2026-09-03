import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin, canEdit } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || (!isAdmin(session.user.role) && !canEdit(session.user.role))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { property: { select: { title: true, slug: true } } },
  });

  const headers = ["Name", "Email", "Phone", "Source", "Status", "Property", "Message", "Created"];
  const rows = leads.map((l) => [
    l.name,
    l.email,
    l.phone || "",
    l.source,
    l.status,
    l.property?.title || "",
    (l.message || "").replace(/"/g, '""'),
    l.createdAt.toISOString(),
  ]);

  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="leads-${Date.now()}.csv"`,
    },
  });
}
