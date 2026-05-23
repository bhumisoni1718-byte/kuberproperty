import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "./constants";
import { absoluteUrl } from "./utils";

type SEOProps = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
};

export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  image,
  noIndex = false,
  keywords = [],
}: SEOProps): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | ${SITE_DESCRIPTION.slice(0, 60)}`;
  const url = absoluteUrl(path);
  const ogImage = image || absoluteUrl("/og-default.jpg");

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title || SITE_NAME }],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function propertyJsonLd(property: {
  title: string;
  description: string;
  slug: string;
  price: number;
  address: string;
  city: string;
  state: string;
  images: string[];
  bedrooms?: number | null;
  areaSqFt?: number | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: absoluteUrl(`/properties/${property.slug}`),
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "INR",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
      addressCountry: "IN",
    },
    image: property.images,
    numberOfRooms: property.bedrooms,
    floorSize: property.areaSqFt
      ? { "@type": "QuantitativeValue", value: property.areaSqFt, unitCode: "FTK" }
      : undefined,
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl(),
    telephone: "+919876543210",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vadodara",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    areaServed: ["Vadodara", "Gujarat"],
    priceRange: "₹₹₹",
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
