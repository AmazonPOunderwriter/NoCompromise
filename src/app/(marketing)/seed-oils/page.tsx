// src/app/(marketing)/seed-oils/page.tsx
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { BANNED_INGREDIENTS } from "@/server/compliance/rules";

export const metadata = { title: "Why We Ban Seed Oils" };

export default function SeedOilsPage() {
  const seedOils = BANNED_INGREDIENTS.filter((b) =>
    ["oil"].some((k) => b.displayName.toLowerCase().includes(k)),
  );

  return (
    <div className="container-prose py-16 md:py-24">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Education
      </div>
      <h1 className="font-serif text-5xl md:text-6xl mt-3 leading-tight">
        Why we ban seed oils — all of them.
      </h1>
      <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
        Industrial seed oils are the single largest change to the modern human
        diet. They&apos;re also the easiest category to eliminate — if you know
        where they hide.
      </p>

      <div className="mt-12 space-y-8 prose prose-lg max-w-none">
        <section>
          <h2 className="font-serif text-3xl">What they are</h2>
          <p>
            Seed oils are industrial fats extracted from crops that don&apos;t
            produce oil naturally. Getting oil out of a soybean, canola seed, or
            cottonseed requires high heat, chemical solvents (usually hexane),
            bleaching, and deodorizing. The end product is a highly refined,
            unstable fat — and it&apos;s in nearly every packaged food, most
            restaurants, and most grocery store staples.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl">Why they&apos;re a problem</h2>
          <p>
            Seed oils are dominated by linoleic acid — a polyunsaturated fat that
            oxidizes rapidly under heat, light, and storage. Oxidized lipids
            create reactive compounds your body has to neutralize. And because
            seed oils have replaced traditional fats in the modern diet, the
            average person&apos;s intake has gone from roughly 2% of calories to
            over 20% in a century.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl">Every seed oil we ban</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 not-prose">
            {seedOils.map((s) => (
              <div key={s.key} className="flex items-start gap-3 rounded-xl border border-border p-4">
                <X className="h-4 w-4 text-destructive mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">{s.displayName}</div>
                  <p className="text-sm text-muted-foreground mt-1">{s.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl">What we use instead</h2>
          <p>
            Traditional fats that humans have eaten for thousands of years: beef
            tallow, ghee, butter, extra virgin olive oil, coconut oil, and
            cold-pressed avocado oil. Stable under heat, stable on the shelf,
            recognizable as food.
          </p>
        </section>

        <div className="not-prose mt-12">
          <Link href="/shop?category=cooking-fats" className="btn-primary">
            Shop clean fats <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
