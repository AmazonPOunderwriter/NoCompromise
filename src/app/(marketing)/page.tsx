// src/app/(marketing)/page.tsx
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Search as SearchIcon } from "lucide-react";
import { getFeaturedProducts, getStaffPicks } from "@/server/products/queries";
import { ProductCard } from "@/components/product/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [featured, staffPicks, categories] = await Promise.all([
    getFeaturedProducts(8),
    getStaffPicks(4),
    prisma.category.findMany({ where: { parentId: null }, orderBy: { sortOrder: "asc" }, take: 6 }),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="container-wide pt-20 pb-24 md:pt-28 md:pb-32 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 space-y-8 animate-fade-up">
            <div className="chip">
              <Leaf className="h-3 w-3" />
              Zero Compromise Standard
            </div>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight">
              The strictest food standard online.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              No seed oils. No shortcuts. No exceptions. Every product is rigorously screened against our
              ingredient standard — so you can shop once, and trust everything.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">
                Shop the Market <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/standard" className="btn-ghost">
                See Our Standard
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <span>✓ 15+ banned ingredients</span>
              <span>✓ Label-level review</span>
              <span>✓ Brand vetting</span>
            </div>
          </div>
          <div className="md:col-span-5 relative">
            <div className="aspect-[4/5] rounded-[28px] bg-gradient-to-br from-primary/10 via-secondary to-accent/60 border border-border/60 overflow-hidden relative">
              <div className="absolute inset-6 rounded-[22px] border border-background/60 bg-background/40 backdrop-blur-sm grid place-items-center">
                <div className="text-center space-y-3 p-8">
                  <ShieldCheck className="h-10 w-10 mx-auto text-primary" />
                  <div className="font-serif text-3xl leading-tight">Shop once.<br/>Trust everything.</div>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    We do the label reading for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-wide py-20">
        <SectionHeader
          eyebrow="Shop by category"
          title="Curated, not cluttered."
          subtitle="Every category is a short list — only the brands that pass."
        />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="group relative aspect-square rounded-2xl border border-border bg-secondary/40 p-5 flex flex-col justify-between hover:border-primary/40 transition-colors"
            >
              <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Category
              </div>
              <div>
                <div className="font-serif text-xl leading-tight">{c.name}</div>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">
                  Shop <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* THE STANDARD */}
      <section className="bg-secondary/40 border-y border-border/60">
        <div className="container-wide py-24 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-5">
            <div className="chip"><ShieldCheck className="h-3 w-3" /> Our standard</div>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              The Zero Compromise Standard.
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              We screen every product against a strict list of banned and caution ingredients.
              If it doesn't pass, it doesn't list.
            </p>
            <Link href="/standard" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              Read the full standard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
            <StandardCard
              icon={<SearchIcon className="h-5 w-5" />}
              step="01"
              title="Label-level review"
              body="Every ingredient, every sub-ingredient. No 'natural flavors' pass without context."
            />
            <StandardCard
              icon={<ShieldCheck className="h-5 w-5" />}
              step="02"
              title="Rule-based screening"
              body="Automated scan against 15+ banned seed oils, preservatives, and dyes."
            />
            <StandardCard
              icon={<Sparkles className="h-5 w-5" />}
              step="03"
              title="Manual brand vetting"
              body="We verify sourcing, processing methods, and brand transparency."
            />
            <StandardCard
              icon={<Leaf className="h-5 w-5" />}
              step="04"
              title="Ongoing audit"
              body="Reformulations get re-reviewed. One slip and the product is delisted."
            />
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container-wide py-20">
        <SectionHeader
          eyebrow="Best sellers"
          title="The shelf, curated."
          subtitle="These passed. Everything else didn't."
          action={{ href: "/shop", label: "Shop all" }}
        />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* MEMBERSHIP TEASER */}
      <section className="container-wide py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_10%,white,transparent_40%)]" />
          <div className="relative p-10 md:p-16 grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="chip !bg-white/10 !border-white/20 !text-white/80">Zero Compromise Member</div>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight">
                Membership for people who read every label.
              </h2>
              <p className="text-primary-foreground/80 max-w-md leading-relaxed">
                Exclusive drops. Member pricing. Free shipping over $50. Early access to vetted brands.
              </p>
              <Link href="/membership" className="inline-flex items-center gap-2 rounded-full bg-white text-primary px-6 py-3 text-sm font-medium hover:bg-white/90 transition">
                Join the Market <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="space-y-3 text-sm text-primary-foreground/90">
              {[
                "10% off every order, every time",
                "Free shipping on orders over $50",
                "Early access to new brand launches",
                "Members-only drops and limited runs",
                "Cancel anytime. No fine print.",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/70" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* STAFF PICKS */}
      {staffPicks.length > 0 && (
        <section className="container-wide py-20">
          <SectionHeader
            eyebrow="Staff picks"
            title="What we actually keep in our pantries."
          />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {staffPicks.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* TRUST */}
      <section className="container-wide py-20">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "No seed oils. Ever.", body: "Canola, soy, sunflower, safflower, corn — all banned, no exceptions." },
            { title: "No artificial anything.", body: "No artificial flavors, dyes, or preservatives. We reject the whole category." },
            { title: "No mystery ingredients.", body: "If a label says 'natural flavors' without context, we ask. If we can't verify, we don't list." },
          ].map((t) => (
            <div key={t.title} className="rounded-2xl border border-border bg-card p-7">
              <h3 className="font-serif text-xl leading-tight">{t.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div className="max-w-2xl space-y-2">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</div>
        <h2 className="font-serif text-4xl md:text-5xl leading-tight">{title}</h2>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href} className="inline-flex items-center gap-1.5 text-sm font-medium hover:text-primary transition">
          {action.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function StandardCard({
  icon,
  step,
  title,
  body,
}: {
  icon: React.ReactNode;
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-9 w-9 grid place-items-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">{step}</span>
      </div>
      <h3 className="font-serif text-lg leading-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
