import Link from "next/link";
import { CONTACT, SITE_NAME, SOCIAL, LOCAL_SEO_KEYWORDS } from "@/lib/constants";

const footerLinks = {
  Properties: [
    { href: "/properties?type=Apartment", label: "Luxury Apartments" },
    { href: "/properties?type=Villa", label: "Villas" },
    { href: "/properties?type=Commercial", label: "Commercial" },
    { href: "/properties?bedrooms=2", label: "2 BHK Flats Vadodara" },
    { href: "/properties?bedrooms=3", label: "3 BHK Flats Vadodara" },
  ],
  Areas: [
    { href: "/areas/alkapuri-vadodara", label: "Alkapuri" },
    { href: "/areas/manjalpur-vadodara", label: "Manjalpur" },
    { href: "/areas/gotri-vadodara", label: "Gotri" },
    { href: "/areas/akota-vadodara", label: "Akota" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/admin/login", label: "Admin" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-2xl font-bold">{SITE_NAME}</h2>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              Premium real estate consultant in Vadodara, Gujarat. Luxury flats,
              commercial property & investment advisory.
            </p>
            <div className="mt-6 flex gap-4">
              {Object.entries(SOCIAL).map(([key, href]) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm capitalize text-gold hover:underline"
                >
                  {key}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              Contact
            </h3>
            <address className="not-italic text-sm text-white/70 space-y-2">
              <p>{CONTACT.address}</p>
              <p>
                <a href={`tel:${CONTACT.phone}`} className="hover:text-gold">
                  {CONTACT.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-gold">
                  {CONTACT.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-xs text-white/50 text-center mb-4">
            {LOCAL_SEO_KEYWORDS.join(" • ")}
          </p>
          <p className="text-center text-sm text-white/50">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
