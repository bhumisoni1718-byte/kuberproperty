"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CONTACT, SITE_NAME } from "@/lib/constants";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/areas", label: "Areas" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur-xl animate-fade-in">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white lg:text-2xl">
            {SITE_NAME}
          </span>
          <span className="hidden h-4 w-px bg-gold sm:block" />
          <span className="hidden text-xs uppercase tracking-widest text-gold sm:block">
            Luxury Realty
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/80 transition hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-1 text-sm text-white">
            <Phone className="h-4 w-4 text-gold" />
            {CONTACT.phone}
          </a>
          <Button variant="gold" size="sm" asChild>
            <Link href="/contact">Get Consultation</Link>
          </Button>
        </div>

        <button
          className="lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </button>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-white/10 bg-navy transition-all",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="flex flex-col gap-4 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white font-medium"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button variant="gold" asChild>
            <Link href="/contact" onClick={() => setOpen(false)}>
              Get Consultation
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
