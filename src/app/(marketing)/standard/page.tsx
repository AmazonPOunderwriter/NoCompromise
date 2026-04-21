// src/app/(marketing)/standard/page.tsx
import { BANNED_INGREDIENTS, CAUTION_INGREDIENTS } from "@/server/compliance/rules";
import { X, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata = { title: "Our Standard" };

export default function StandardPage() {
  return (
    <div className="container-prose py-16 md:py-24">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Our Standard
      </div>
      <h1 className="font-serif text-5xl md:text-6xl mt-3 leading-tight">
        The Zero Compromise Standard.
      </h1>
      <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
        We don&apos;t grade on a curve. We don&apos;t have a &quot;better than
        average&quot; tier. A product either passes our standard, or it
        doesn&apos;t list. Here&apos;s exactly what that means.
      </p>

      <section className="mt-16">
        <h2 className="font-serif text-3xl flex items-center gap-3">
          <X className="h-6 w-6 text-destructive" /> Banned — no exceptions
        </h2>
        <p className="mt-3 text-muted-foreground">
          If a product contains any of these, it is automatically rejected.
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          {BANNED_INGREDIENTS.map((b) => (
            <div
              key={b.key}
              className="rounded-xl border border-destructive/20 bg-destructive/5 p-4"
            >
              <div className="font-medium">{b.displayName}</div>
              <p className="text-sm text-muted-foreground mt-1">{b.rationale}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-3xl flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-amber-600" /> Caution — manual review
        </h2>
        <p className="mt-3 text-muted-foreground">
          These trigger a manual review. We require brand clarification before
          approving.
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          {CAUTION_INGREDIENTS.map((c) => (
            <div
              key={c.key}
              className="rounded-xl border border-amber-300 bg-amber-50 p-4"
            >
              <div className="font-medium">{c.displayName}</div>
              <p className="text-sm text-muted-foreground mt-1">{c.rationale}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-primary/30 bg-primary/5 p-8">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <h2 className="font-serif text-3xl mt-4">Our commitment</h2>
        <p className="mt-3 text-foreground/80 leading-relaxed">
          Brands reformulate. Supply chains change. We re-review. If a product
          drops below standard, we delist — even if it&apos;s selling well. Our
          reputation depends on being right, not being large.
        </p>
      </section>
    </div>
  );
}
