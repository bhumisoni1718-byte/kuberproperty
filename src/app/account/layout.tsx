import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-navy text-white">
        <div className="container mx-auto px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              Kuber Property
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm">{session.user.email}</span>
              <Button variant="gold" size="sm" asChild>
                <Link href="/admin/logout">Logout</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8 lg:px-8">{children}</div>
    </div>
  );
}
