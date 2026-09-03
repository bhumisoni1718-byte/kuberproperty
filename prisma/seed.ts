import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ADMIN_CREDENTIALS, EDITOR_CREDENTIALS, AGENT_CREDENTIALS } from "@/lib/admin-credentials";

const prisma = new PrismaClient();

const SITE_DESCRIPTION =
  "Premium property dealer in Vadodara offering luxury flats, commercial property & real estate consulting.";

async function main() {
  console.log("Seeding Kuber Property database...");

  const adminPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, 12);
  const editorPassword = await bcrypt.hash(EDITOR_CREDENTIALS.password, 12);
  const agentPassword = await bcrypt.hash(AGENT_CREDENTIALS.password, 12);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_CREDENTIALS.email },
    update: { password: adminPassword },
    create: {
      email: ADMIN_CREDENTIALS.email,
      name: ADMIN_CREDENTIALS.name,
      password: adminPassword,
      role: ADMIN_CREDENTIALS.role,
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: EDITOR_CREDENTIALS.email },
    update: { password: editorPassword },
    create: {
      email: EDITOR_CREDENTIALS.email,
      name: EDITOR_CREDENTIALS.name,
      password: editorPassword,
      role: EDITOR_CREDENTIALS.role,
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: AGENT_CREDENTIALS.email },
    update: { password: agentPassword },
    create: {
      email: AGENT_CREDENTIALS.email,
      name: AGENT_CREDENTIALS.name,
      password: agentPassword,
      role: AGENT_CREDENTIALS.role,
      phone: AGENT_CREDENTIALS.phone,
      bio: AGENT_CREDENTIALS.bio,
    },
  });

  const areas = await Promise.all(
    [
      { name: "Alkapuri", slug: "alkapuri-vadodara", featured: true },
      { name: "Gotri", slug: "gotri-vadodara", featured: true },
      { name: "Manjalpur", slug: "manjalpur-vadodara", featured: true },
      { name: "Akota", slug: "akota-vadodara", featured: true },
      { name: "Vasna", slug: "vasna-vadodara", featured: false },
    ].map((a) =>
      prisma.area.upsert({
        where: { slug: a.slug },
        update: {},
        create: {
          ...a,
          city: "Vadodara",
          state: "Gujarat",
          description: `Premium properties in ${a.name}, Vadodara.`,
          seoTitle: `Properties in ${a.name}, Vadodara | Kuber Property`,
          seoDescription: `Browse luxury flats and commercial property in ${a.name}, Vadodara.`,
        },
      })
    )
  );

  const amenities = ["Swimming Pool", "Gym", "Parking", "Security", "Club House", "Garden"];
  for (const name of amenities) {
    await prisma.amenity.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const properties = [
    {
      title: "Luxury 3 BHK Penthouse in Alkapuri",
      slug: "luxury-3bhk-penthouse-alkapuri",
      description:
        "Experience unparalleled luxury in this stunning 3 BHK penthouse located in the heart of Alkapuri, Vadodara. Featuring panoramic city views, Italian marble flooring, modular kitchen, and premium fixtures throughout.",
      price: 28500000,
      propertyType: "Penthouse",
      bedrooms: 3,
      bathrooms: 3,
      areaSqFt: 2450,
      address: "RC Dutt Road, Alkapuri",
      city: "Vadodara",
      state: "Gujarat",
      pincode: "390007",
      latitude: 22.3115,
      longitude: 73.1666,
      amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Club House"],
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
        "https://images.unsplash.com/photo-1600585154340-be6162a9a0c0?w=1200",
      ],
      featuredImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
      possession: "Ready to Move",
      builder: "Premium Developers",
      featured: true,
      trending: true,
      status: "PUBLISHED" as const,
      areaId: areas[0].id,
      seoTitle: "3 BHK Luxury Penthouse Alkapuri Vadodara",
      seoDescription: "Premium 3 BHK penthouse for sale in Alkapuri, Vadodara. Ready to move luxury home.",
    },
    {
      title: "2 BHK Premium Apartment in Gotri",
      slug: "2bhk-premium-apartment-gotri",
      description:
        "Modern 2 BHK apartment in Gotri with excellent connectivity, vastu-compliant layout, and world-class amenities. Ideal for families and investors.",
      price: 7200000,
      propertyType: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 1150,
      address: "Gotri Road",
      city: "Vadodara",
      state: "Gujarat",
      latitude: 22.2987,
      longitude: 73.1392,
      amenities: ["Gym", "Parking", "Security", "Garden"],
      images: ["https://images.unsplash.com/photo-1502672260266-1c1ef1d93788?w=1200"],
      featuredImage: "https://images.unsplash.com/photo-1502672260266-1c1ef1d93788?w=1200",
      possession: "Ready to Move",
      featured: true,
      status: "PUBLISHED" as const,
      areaId: areas[1].id,
      seoTitle: "2 BHK Flats in Gotri Vadodara",
      seoDescription: "Affordable luxury 2 BHK apartment in Gotri, Vadodara.",
    },
    {
      title: "Commercial Office Space in Alkapuri",
      slug: "commercial-office-alkapuri",
      description:
        "Premium Grade-A commercial office space in Alkapuri business district. Ideal for corporates, startups, and professional services.",
      price: 45000000,
      propertyType: "Commercial",
      areaSqFt: 5200,
      address: "Business Bay, Alkapuri",
      city: "Vadodara",
      state: "Gujarat",
      amenities: ["Parking", "Security"],
      images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200"],
      featuredImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
      possession: "Ready to Move",
      featured: true,
      status: "PUBLISHED" as const,
      areaId: areas[0].id,
      seoTitle: "Commercial Property Vadodara Alkapuri",
      seoDescription: "Premium commercial office space for sale in Alkapuri, Vadodara.",
    },
  ];

  for (const p of properties) {
    await prisma.property.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        createdById: agent.id,
        publishedAt: new Date(),
        videos: [],
        floorPlans: [],
      },
    });
  }

  const blogs = [
    {
      title: "Top 5 Areas to Buy Property in Vadodara 2026",
      slug: "top-areas-buy-property-vadodara-2026",
      excerpt: "Discover the best localities for investment and luxury living in Vadodara.",
      content: `<p>Vadodara continues to be one of Gujarat's most promising real estate markets. Here are the top areas:</p><h2>1. Alkapuri</h2><p>The commercial and residential hub with premium infrastructure.</p><h2>2. Gotri</h2><p>Rapidly developing with excellent ROI potential.</p>`,
      category: "Market Trends",
      tags: ["Vadodara", "Investment"],
      featuredImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
      seoTitle: "Best Areas to Buy Property in Vadodara",
      seoDescription: "Expert guide to the top areas for property investment in Vadodara.",
    },
    {
      title: "Complete Guide to Buying Your First Home in Gujarat",
      slug: "first-home-buying-guide-gujarat",
      excerpt: "Everything first-time buyers need to know about purchasing property in Gujarat.",
      content: `<p>Buying your first home is a milestone. Follow these steps for a smooth purchase in Gujarat.</p><h2>Documentation</h2><p>Ensure clear title, RERA registration, and approved building plans.</p>`,
      category: "Home Buying Guides",
      tags: ["First Home", "Gujarat"],
      featuredImage: "https://images.unsplash.com/photo-1560184897-ae75f4184e70?w=800",
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
    },
  ];

  for (const b of blogs) {
    await prisma.blog.upsert({
      where: { slug: b.slug },
      update: {},
      create: { ...b, authorId: editor.id },
    });
  }

  await prisma.testimonial.createMany({
    data: [
      {
        name: "Priya Shah",
        role: "Home Buyer",
        content: "Kuber Property made our dream home purchase seamless. Highly professional team!",
        rating: 5,
        featured: true,
        order: 1,
      },
      {
        name: "Amit Mehta",
        role: "Investor",
        content: "Excellent market insights and transparent dealings. Best real estate consultant in Vadodara.",
        rating: 5,
        featured: true,
        order: 2,
      },
    ],
  });

  await prisma.fAQ.createMany({
    data: [
      {
        question: "Why choose Kuber Property in Vadodara?",
        answer: "We offer verified luxury listings, expert local knowledge, and end-to-end support for buyers and investors in Vadodara and Gujarat.",
        category: "General",
        order: 1,
      },
      {
        question: "Do you help with home loans?",
        answer: "Yes, we partner with leading banks to assist with home loan documentation and EMI planning.",
        category: "Buying",
        order: 2,
      },
      {
        question: "What areas do you cover?",
        answer: "We cover all major Vadodara localities including Alkapuri, Gotri, Manjalpur, Akota, and surrounding Gujarat regions.",
        category: "Areas",
        order: 3,
      },
    ],
  });

  await prisma.teamMember.createMany({
    data: [
      { name: "Kuber Singh", role: "Founder & CEO", bio: "15+ years in luxury real estate.", order: 1 },
      { name: "Raj Patel", role: "Senior Property Consultant", bio: "Specialist in Vadodara premium listings.", order: 2 },
    ],
  });

  await prisma.siteSettings.upsert({
    where: { key: "homepage" },
    update: {},
    create: {
      key: "homepage",
      value: {
        heroTitle: "Discover Luxury Living with Kuber Property",
        heroSubtitle: "Premium flats, villas & commercial spaces in Vadodara",
        ctaText: "Explore Properties",
      },
    },
  });

  await prisma.siteSettings.upsert({
    where: { key: "seo" },
    update: {},
    create: {
      key: "seo",
      value: {
        defaultTitle: "Kuber Property | Luxury Real Estate Vadodara",
        defaultDescription: SITE_DESCRIPTION,
      },
    },
  });

  console.log("Seed completed!");
  console.log(`Admin: ${ADMIN_CREDENTIALS.email} / ${ADMIN_CREDENTIALS.password}`);
  console.log(`Editor: ${EDITOR_CREDENTIALS.email} / ${EDITOR_CREDENTIALS.password}`);
  console.log(`Agent: ${AGENT_CREDENTIALS.email} / ${AGENT_CREDENTIALS.password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
