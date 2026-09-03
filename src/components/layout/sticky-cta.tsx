"use client";

import Link from "next/link";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { CONTACT } from "@/lib/constants";

export function StickyCTA() {
  const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    "Hi, I am interested in properties from Kuber Property."
  )}`;

  return (
    <>
      <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-3 md:bottom-8">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
          aria-label="WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
        <a
          href={`tel:${CONTACT.phone}`}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-navy shadow-lg transition hover:scale-105 md:hidden"
          aria-label="Call"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>

      <Link
        href="/contact"
        className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-navy/90 md:hidden"
      >
        <Mail className="h-4 w-4 text-gold" />
        Free Consultation
      </Link>
    </>
  );
}
