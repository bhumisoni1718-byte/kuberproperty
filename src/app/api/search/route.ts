import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (q.length < 2) {
    return NextResponse.json({ properties: [], areas: [] });
  }

  const [properties, areas] = await Promise.all([
    prisma.property.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { title: true, slug: true, city: true, price: true },
      take: 5,
    }),
    prisma.area.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      select: { name: true, slug: true, city: true },
      take: 5,
    }),
  ]);

  return NextResponse.json({ properties, areas });
}
