// src/components/storefront/SiteHeader.tsx
import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import { getCart } from "@/server/cart/cart";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/standard", label: "Our Standard" },
  { href: "/journal", label: "Journal" },
  { href: "/membership", label: "Membership" },
  { href: "/about", label: "About" },
];

export async function SiteHeader() {
  const cart = await getCart().catch(() => null);
  const itemCount = cart?.items.reduce((n, i) => n + i.quantity, 0) ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full border border-primary/40 bg-primary/5 grid place-items-center">
            <span className="font-serif text-primary text-sm">N</span>
          </div>
          <span className="font-serif text-lg tracking-tight">NoCompromise</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/shop" aria-label="Search">
            <Search className="h-5 w-5 text-foreground/70 hover:text-foreground" />
          </Link>
          <Link href="/account" aria-label="Account">
            <User className="h-5 w-5 text-foreground/70 hover:text-foreground" />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm hover:bg-accent transition"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="tabular-nums">{itemCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
