import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const savedSearchSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  filters: z.object({
    city: z.string().optional(),
    type: z.string().optional(),
    listingType: z.string().optional(),
    bedrooms: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
  }),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const savedSearches = await prisma.savedSearch.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(savedSearches);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    
    const parsed = savedSearchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId: session?.user?.id || "guest",
        name: parsed.data.name,
        email: parsed.data.email,
        filters: parsed.data.filters,
      },
    });

    return NextResponse.json(savedSearch);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save search" }, { status: 500 });
  }
}
