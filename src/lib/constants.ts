export const SITE_NAME = "Kuber Property";
export const SITE_TAGLINE = "Luxury Real Estate in Vadodara & Gujarat";
export const SITE_DESCRIPTION =
  "Premium property dealer in Vadodara offering luxury flats, commercial property, 2 BHK & 3 BHK apartments. Trusted real estate consultant in Gujarat.";

export const SUPPORT_EMAIL = "support@kuberproperty.in";
export const LEAD_NOTIFICATION_EMAIL =
  process.env.LEAD_NOTIFICATION_EMAIL || "nimesh8524@gmail.com";

export const CONTACT = {
  phone: "+91 9913603144",
  whatsapp: "919913603144",
  email: SUPPORT_EMAIL,
  address: "VINAYAK HEIGHTS, A-704, Uma Nagar, Kendranagar, Vadodara, Gujarat 390025",
};

export const SOCIAL = {
  facebook: "https://facebook.com/kuberproperty",
  instagram: "https://instagram.com/kuberproperty",
  linkedin: "https://linkedin.com/company/kuberproperty",
  youtube: "https://youtube.com/@kuberproperty",
};

export const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Penthouse",
  "Commercial",
  "Plot",
  "Farmhouse",
  "Studio",
] as const;

export const BHK_OPTIONS = [1, 2, 3, 4, 5] as const;

export const BLOG_CATEGORIES = [
  "investment-tips",
  "real-estate-news",
  "home-buying-guides",
  "luxury-properties",
  "commercial-property",
  "market-trends",
] as const;

export const LOCAL_SEO_KEYWORDS = [
  "Property Dealer in Vadodara",
  "Real Estate Agent Vadodara",
  "Luxury Flats Vadodara",
  "Commercial Property Vadodara",
  "2 BHK Flats Vadodara",
  "Real Estate Consultant Gujarat",
];

export const POSSESSION_OPTIONS = [
  "Ready to Move",
  "Under Construction",
  "New Launch",
] as const;

export const DEFAULT_BLOG_AUTHOR = "Kuber Property Team";
