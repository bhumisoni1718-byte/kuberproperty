import { ContactForm } from "@/components/forms/contact-form";
import { buildMetadata } from "@/lib/seo";
import { CONTACT, SOCIAL } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Contact Kuber Property for luxury flats, commercial property & real estate consultation in Vadodara, Gujarat.",
  path: "/contact",
});

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}`;

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-navy py-16 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="font-display text-4xl font-bold">Contact Us</h1>
          <p className="mt-2 text-white/70">We respond within 24 hours</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold text-navy">Send a Message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-card p-8">
              <h2 className="text-xl font-semibold text-navy">Office</h2>
              <address className="mt-4 not-italic text-navy/70 space-y-2">
                <p>{CONTACT.address}</p>
                <p>
                  <a href={`tel:${CONTACT.phone}`} className="text-gold hover:underline">
                    {CONTACT.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${CONTACT.email}`} className="text-gold hover:underline">
                    {CONTACT.email}
                  </a>
                </p>
              </address>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-md bg-[#25D366] px-4 py-2 text-sm font-medium text-white"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-xl font-semibold text-navy">Follow Us</h2>
              <div className="mt-4 flex flex-wrap gap-4">
                {Object.entries(SOCIAL).map(([name, url]) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="capitalize text-gold hover:underline">
                    {name}
                  </a>
                ))}
              </div>
            </div>

            <iframe
              title="Office location"
              className="w-full h-64 rounded-xl border"
              loading="lazy"
              src="https://maps.google.com/maps?q=22.2818087,73.2317808&z=17&output=embed"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
