import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StickyCTA } from "@/components/layout/sticky-cta";
import { buildMetadata, localBusinessJsonLd } from "@/lib/seo";
import { SITE_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  description: SITE_DESCRIPTION,
  keywords: [
    "Property Dealer Vadodara",
    "Luxury Flats Vadodara",
    "Real Estate Gujarat",
    "Kuber Property",
  ],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = localBusinessJsonLd();

  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          suppressHydrationWarning
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NSHDRCQN');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NSHDRCQN"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyCTA />
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  );
}
