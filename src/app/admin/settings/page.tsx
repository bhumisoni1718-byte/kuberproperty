import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findMany();

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Site Settings</h1>
      <p className="text-sm text-navy/60 mt-2">
        CMS settings stored as key-value JSON. Use upsertSiteSetting server action to update homepage, hero, footer & SEO content without code changes.
      </p>
      <div className="mt-6 space-y-4">
        {settings.length === 0 ? (
          <p className="text-navy/50">No settings yet. Seed data creates defaults.</p>
        ) : (
          settings.map((s) => (
            <div key={s.id} className="rounded-xl border bg-white p-4">
              <p className="font-mono text-sm font-medium">{s.key}</p>
              <pre className="mt-2 text-xs text-navy/70 overflow-auto">
                {JSON.stringify(s.value, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
