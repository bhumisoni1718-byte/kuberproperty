import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SavedSearchesList } from "@/components/account/saved-searches-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SavedSearchesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const savedSearches = await prisma.savedSearch.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy">Saved Searches</h1>
          <p className="text-navy/60 mt-2">Manage your property search alerts</p>
        </div>
        <Button variant="gold" asChild>
          <Link href="/properties">New Search</Link>
        </Button>
      </div>

      {savedSearches.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-navy/60 mb-4">No saved searches yet</p>
          <Button variant="gold" asChild>
            <Link href="/properties">Start Searching</Link>
          </Button>
        </div>
      ) : (
        <SavedSearchesList searches={savedSearches} />
      )}
    </div>
  );
}
