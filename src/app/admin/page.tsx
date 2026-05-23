import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, MessageSquare, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) return null;

  const [properties, blogs, leads, newLeads] = await Promise.all([
    prisma.property.count(),
    prisma.blog.count(),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
  ]);

  const recentLeads = await prisma.lead.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { property: { select: { title: true } } },
  });

  const stats = [
    { label: "Total Properties", value: properties, icon: Building2, href: "/admin/properties" },
    { label: "Blog Posts", value: blogs, icon: FileText, href: "/admin/blogs" },
    { label: "Total Leads", value: leads, icon: MessageSquare, href: "/admin/leads" },
    { label: "New Leads", value: newLeads, icon: TrendingUp, href: "/admin/leads?status=NEW" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
      <p className="text-navy/60">Welcome back, {session.user.name || session.user.email}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="bg-white border-navy/10 hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-navy/70">{s.label}</CardTitle>
                <s.icon className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-navy">{s.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8 bg-white border-navy/10">
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-navy/60">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Source</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((l) => (
                  <tr key={l.id} className="border-b border-navy/5">
                    <td className="py-3">{l.name}</td>
                    <td>{l.email}</td>
                    <td>{l.source}</td>
                    <td>
                      <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs text-navy">
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/admin/leads" className="mt-4 inline-block text-sm text-gold hover:underline">
            View all leads →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
