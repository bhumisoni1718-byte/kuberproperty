import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";
import { SITE_NAME } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about Kuber Property — Vadodara's trusted luxury real estate consultant. Our mission, team & achievements.",
  path: "/about",
});

export const revalidate = 86400;

export default async function AboutPage() {
  const team = await safeDb(
    () => prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
    []
  );

  return (
    <div className="bg-white">
      <section className="bg-navy py-20 text-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h1 className="font-display text-4xl font-bold">About {SITE_NAME}</h1>
          <p className="mt-6 text-lg text-white/80 leading-relaxed">
            Founded with a vision to redefine luxury real estate in Vadodara, Kuber Property
            has become the preferred partner for discerning buyers, investors, and NRI clients
            seeking premium homes and commercial spaces across Gujarat.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy">Our Mission</h2>
            <p className="mt-4 text-navy/70 leading-relaxed">
              To deliver transparent, premium real estate experiences that help families find
              their dream homes and investors build lasting wealth through strategic property
              acquisitions in Vadodara and beyond.
            </p>
            <h2 className="font-display text-2xl font-bold text-navy mt-10">Our Vision</h2>
            <p className="mt-4 text-navy/70 leading-relaxed">
              To be Gujarat&apos;s most trusted luxury property brand — known for integrity,
              market expertise, and white-glove client service.
            </p>
            <h2 className="font-display text-2xl font-bold text-navy mt-10">Why Choose Us</h2>
            <div className="mt-4 space-y-4 text-navy/70">
              <p>
                At Kuber Property, we believe that real estate is more than just transactions — it's about building relationships and helping people achieve their dreams of owning a home. With over 15 years of experience in the Vadodara real estate market, we have developed deep insights into local property trends, neighborhood developments, and investment opportunities.
              </p>
              <p>
                Our team of dedicated professionals works tirelessly to ensure that every client receives personalized attention and expert guidance throughout their property journey. Whether you're a first-time homebuyer, an experienced investor, or an NRI looking to invest in Gujarat, we have the expertise and resources to help you make informed decisions.
              </p>
              <p>
                We specialize in luxury apartments, villas, penthouses, and commercial properties in Vadodara's most sought-after locations. Our portfolio includes properties from reputed developers and ensures that every listing meets our stringent quality standards. We verify legal documentation, check construction quality, and ensure that every property we offer is a sound investment.
              </p>
              <p>
                Transparency is at the core of our business philosophy. We provide complete information about properties, including pricing, amenities, location advantages, and potential for appreciation. Our clients appreciate our honest approach and commitment to their best interests, which has resulted in a 98% client satisfaction rate.
              </p>
            </div>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
              alt="Kuber Property office"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-3 text-center">
          {[
            { label: "Properties Sold", value: "500+" },
            { label: "Client Satisfaction", value: "98%" },
            { label: "Industry Awards", value: "12+" },
          ].map((a) => (
            <div key={a.label} className="glass-card p-8">
              <p className="text-3xl font-bold text-gold">{a.value}</p>
              <p className="mt-2 text-navy/70">{a.label}</p>
            </div>
          ))}
        </div>
      </section>

      {team.length > 0 && (
        <section className="bg-cream py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="font-display text-3xl font-bold text-navy text-center">Our Team</h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <div key={member.id} className="glass-card p-6 text-center">
                  {member.image && (
                    <div className="relative mx-auto h-24 w-24 rounded-full overflow-hidden">
                      <Image src={member.image} alt={member.name} fill className="object-cover" />
                    </div>
                  )}
                  <h3 className="mt-4 font-semibold text-navy">{member.name}</h3>
                  <p className="text-sm text-gold">{member.role}</p>
                  {member.bio && <p className="mt-2 text-sm text-navy/60">{member.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
