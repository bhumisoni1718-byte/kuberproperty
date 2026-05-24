import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const properties = await prisma.property.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(properties);
}
