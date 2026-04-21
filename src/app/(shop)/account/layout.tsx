// src/app/(shop)/account/layout.tsx
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <SiteHeader />
      <main className="container-wide py-12">
        <div className="grid md:grid-cols-[220px_1fr] gap-10">
          <aside>
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                Account
              </div>
              <SideLink href="/account" label="Dashboard" />
              <SideLink href="/account/orders" label="Orders" />
              <SideLink href="/account/addresses" label="Addresses" />
              <SideLink href="/account/membership" label="Membership" />
              <SideLink href="/account/wishlist" label="Wishlist" />
              <form action="/api/auth/signout" method="post" className="pt-4">
                <button className="text-sm text-muted-foreground hover:text-destructive">
                  Sign out
                </button>
              </form>
            </div>
          </aside>
          <div>{children}</div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function SideLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-lg px-3 py-2 text-sm hover:bg-secondary transition"
    >
      {label}
    </Link>
  );
}
