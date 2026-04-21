// src/components/storefront/SiteFooter.tsx
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/30">
      <div className="container-wide py-16 grid gap-12 md:grid-cols-5">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full border border-primary/40 bg-primary/5 grid place-items-center">
              <span className="font-serif text-primary text-sm">N</span>
            </div>
            <span className="font-serif text-lg">NoCompromise Market</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            The strictest food standard online. No seed oils. No shortcuts. No exceptions.
          </p>
          <form className="flex max-w-sm gap-2 pt-2" action="/api/newsletter" method="post">
            <input
              type="email"
              required
              placeholder="Your email"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button className="btn-primary !py-2 !px-5">Join</button>
          </form>
        </div>

        <FooterColumn
          title="Shop"
          links={[
            { href: "/shop", label: "All Products" },
            { href: "/category/cooking-fats", label: "Cooking Fats" },
            { href: "/category/pantry-staples", label: "Pantry Staples" },
            { href: "/category/snacks", label: "Snacks" },
            { href: "/category/beverages", label: "Beverages" },
          ]}
        />
        <FooterColumn
          title="About"
          links={[
            { href: "/standard", label: "Our Standard" },
            { href: "/seed-oils", label: "Why Seed Oils Are Banned" },
            { href: "/journal", label: "Journal" },
            { href: "/about", label: "Our Story" },
            { href: "/contact", label: "Contact" },
          ]}
        />
        <FooterColumn
          title="Support"
          links={[
            { href: "/faq", label: "FAQ" },
            { href: "/account", label: "My Account" },
            { href: "/membership", label: "Membership" },
            { href: "/terms", label: "Terms" },
            { href: "/privacy", label: "Privacy" },
          ]}
        />
      </div>

      <div className="hairline">
        <div className="container-wide flex flex-col sm:flex-row items-center justify-between py-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} NoCompromise Market. All rights reserved.</span>
          <span className="mt-2 sm:mt-0">Curated with zero compromise.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/80 mb-4">{title}</h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
