import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const areas = await prisma.area.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(areas);
  } catch (error) {
    console.error("Failed to fetch areas:", error);
    return NextResponse.json({ error: "Failed to fetch areas" }, { status: 500 });
  }
}
