import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { updateLeadStatus } from "@/actions/admin";
import { Download } from "lucide-react";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const leads = await prisma.lead.findMany({
    where: status ? { status: status as "NEW" } : undefined,
    orderBy: { createdAt: "desc" },
    include: { property: { select: { title: true, slug: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Lead Management</h1>
        <Button variant="outline" asChild>
          <a href="/api/admin/leads/export">
            <Download className="h-4 w-4" /> Export CSV
          </a>
        </Button>
      </div>

      <div className="mt-4 flex gap-2">
        {["", "NEW", "CONTACTED", "QUALIFIED", "CLOSED"].map((s) => (
          <Link
            key={s || "all"}
            href={s ? `/admin/leads?status=${s}` : "/admin/leads"}
            className={`rounded-md px-3 py-1 text-sm ${
              status === s || (!status && !s) ? "bg-navy text-white" : "bg-white text-navy"
            }`}
          >
            {s || "All"}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {leads.map((lead) => (
          <div key={lead.id} className="rounded-xl border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-navy">{lead.name}</p>
                <p className="text-sm text-navy/60">{lead.email} • {lead.phone}</p>
                {lead.property && (
                  <Link
                    href={`/properties/${lead.property.slug}`}
                    className="text-sm text-gold hover:underline"
                  >
                    {lead.property.title}
                  </Link>
                )}
                {lead.message && <p className="mt-2 text-sm text-navy/70">{lead.message}</p>}
              </div>
              <div className="text-right">
                <span className="rounded-full bg-gold/20 px-2 py-1 text-xs">{lead.status}</span>
                <p className="mt-1 text-xs text-navy/50">{lead.source}</p>
                <p className="text-xs text-navy/50">{lead.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
            <form
              action={async (fd) => {
                "use server";
                await updateLeadStatus(lead.id, fd.get("status") as string);
              }}
              className="mt-4 flex gap-2"
            >
              <select
                name="status"
                defaultValue={lead.status}
                className="rounded-md border px-2 py-1 text-sm"
              >
                {["NEW", "CONTACTED", "QUALIFIED", "NEGOTIATION", "CLOSED", "LOST"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <Button type="submit" size="sm" variant="outline">Update</Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
