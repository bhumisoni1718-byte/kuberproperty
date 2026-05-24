import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all active saved searches
    const savedSearches = await prisma.savedSearch.findMany({
      where: { active: true },
    });

    let notificationsSent = 0;

    for (const savedSearch of savedSearches) {
      const filters = savedSearch.filters as any;
      const lastNotifiedAt = savedSearch.lastNotifiedAt || new Date(0);

      // Build Prisma query based on filters
      const where: any = {
        status: "PUBLISHED",
        publishedAt: { gt: lastNotifiedAt },
      };

      if (filters.city) where.city = { contains: filters.city, mode: "insensitive" };
      if (filters.type) where.propertyType = filters.type;
      if (filters.listingType) where.listingType = filters.listingType;
      if (filters.bedrooms) where.bedrooms = parseInt(filters.bedrooms);
      if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice) where.price.gte = parseFloat(filters.minPrice);
        if (filters.maxPrice) where.price.lte = parseFloat(filters.maxPrice);
      }

      // Find matching properties
      const matchingProperties = await prisma.property.findMany({
        where,
        take: 10,
        orderBy: { publishedAt: "desc" },
      });

      if (matchingProperties.length > 0) {
        // Send email notification
        const propertyList = matchingProperties
          .map(
            (p) => `
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
              <h3 style="margin: 0 0 8px 0; color: #0a1628;">${p.title}</h3>
              <p style="margin: 0 0 8px 0; color: #666;">${p.city} • ${p.propertyType}</p>
              <p style="margin: 0 0 12px 0; font-weight: bold; color: #c9a227;">₹${p.price.toLocaleString()}</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/properties/${p.slug}" 
                 style="display: inline-block; background: #c9a227; color: #0a1628; padding: 8px 16px; text-decoration: none; border-radius: 4px;">
                View Property
              </a>
            </div>
          `
          )
          .join("");

        await sendEmail({
          to: savedSearch.email,
          subject: `New Properties Match Your Search: ${savedSearch.name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #0a1628;">New Properties Available</h1>
              <p style="color: #666;">We found ${matchingProperties.length} new properties matching your saved search "<strong>${savedSearch.name}</strong>".</p>
              ${propertyList}
              <p style="color: #666; margin-top: 24px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/saved-searches" 
                   style="color: #c9a227;">Manage your saved searches</a>
              </p>
            </div>
          `,
        });

        // Update last notified timestamp
        await prisma.savedSearch.update({
          where: { id: savedSearch.id },
          data: { lastNotifiedAt: new Date() },
        });

        notificationsSent++;
      }
    }

    return NextResponse.json({
      success: true,
      notificationsSent,
      totalSearches: savedSearches.length,
    });
  } catch (error) {
    console.error("Error checking saved searches:", error);
    return NextResponse.json({ error: "Failed to check saved searches" }, { status: 500 });
  }
}
