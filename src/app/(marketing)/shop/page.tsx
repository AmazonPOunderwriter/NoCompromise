// src/app/(marketing)/shop/page.tsx
import { listPublishedProducts } from "@/server/products/queries";
import { ProductCard } from "@/components/product/ProductCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Shop" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    sort?: string;
    q?: string;
    badges?: string;
  }>;
}) {
  const sp = await searchParams;
  const [products, categories, badges] = await Promise.all([
    listPublishedProducts({
      categorySlug: sp.category,
      brandSlug: sp.brand,
      search: sp.q,
      sort: (sp.sort as "newest" | "price_asc" | "price_desc" | "featured") ?? "featured",
      badgeSlugs: sp.badges?.split(",").filter(Boolean),
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.badge.findMany(),
  ]);

  return (
    <div className="container-wide py-12 md:py-16">
      <div className="space-y-3 mb-10">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Shop</div>
        <h1 className="font-serif text-5xl">The entire shelf.</h1>
        <p className="text-muted-foreground">
          {products.length} product{products.length === 1 ? "" : "s"}. All approved. Zero compromise.
        </p>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-10">
        <aside className="space-y-8">
          <FilterGroup title="Category">
            <FilterLink href="/shop" label="All" active={!sp.category} />
            {categories.map((c) => (
              <FilterLink
                key={c.id}
                href={`/shop?category=${c.slug}`}
                label={c.name}
                active={sp.category === c.slug}
              />
            ))}
          </FilterGroup>
          <FilterGroup title="Badges">
            {badges.map((b) => (
              <FilterLink
                key={b.id}
                href={`/shop?badges=${b.slug}`}
                label={b.name}
                active={sp.badges?.includes(b.slug) ?? false}
              />
            ))}
          </FilterGroup>
        </aside>

        <div>
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-16 text-center">
              <p className="text-muted-foreground">No products match your filters.</p>
              <Link href="/shop" className="btn-ghost mt-6 inline-flex">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.15em] text-foreground/80 mb-3">{title}</h3>
      <ul className="space-y-1.5">{children}</ul>
    </div>
  );
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`block text-sm transition-colors ${
          active
            ? "text-primary font-medium"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {label}
      </Link>
    </li>
  );
}
