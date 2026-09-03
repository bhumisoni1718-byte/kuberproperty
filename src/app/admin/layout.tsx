import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Users,
  MessageSquare,
  Settings,
  HelpCircle,
  Star,
  MapPin,
  LogOut,
} from "lucide-react";
import { auth, signOut, isAdmin, canEdit, canManageProperties } from "@/auth";
import { SITE_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

const allNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "EDITOR", "AGENT"] },
  { href: "/admin/properties", label: "Properties", icon: Building2, roles: ["ADMIN", "EDITOR", "AGENT"] },
  { href: "/admin/blogs", label: "Blogs", icon: FileText, roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/leads", label: "Leads", icon: MessageSquare, roles: ["ADMIN", "EDITOR", "AGENT"] },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star, roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/team", label: "Team", icon: Users, roles: ["ADMIN"] },
  { href: "/admin/areas", label: "Areas", icon: MapPin, roles: ["ADMIN", "EDITOR"] },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["ADMIN"] },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userRole = session?.user.role;

  const nav = allNav.filter((item) => item.roles.includes(userRole as string));

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {session && (
        <aside className="hidden w-64 flex-shrink-0 bg-navy text-white lg:flex lg:flex-col">
          <div className="p-6 border-b border-white/10">
            <Link href="/admin" className="font-bold text-lg">
              {SITE_NAME}
            </Link>
            <p className="text-xs text-white/50 mt-1">Admin CMS</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <p className="text-xs text-white/50 truncate">{session.user.email}</p>
            <p className="text-xs text-gold capitalize">{session.user.role.toLowerCase()}</p>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
              className="mt-3"
            >
              <button
                type="submit"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </form>
          </div>
        </aside>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        {session && (
          <header className="bg-white border-b px-4 py-3 lg:hidden flex items-center justify-between">
            <Link href="/admin" className="font-bold text-navy">
              {SITE_NAME} Admin
            </Link>
            <Link href="/" className="text-sm text-gold">
              View Site
            </Link>
          </header>
        )}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
