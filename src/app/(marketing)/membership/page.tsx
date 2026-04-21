// src/app/(marketing)/membership/page.tsx
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Membership" };

export default async function MembershipPage() {
  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const perks = [
    "10% off every order",
    "Free shipping over $50",
    "Early access to new brands",
    "Members-only drops",
    "Cancel anytime",
  ];

  return (
    <div className="container-wide py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Membership
        </div>
        <h1 className="font-serif text-5xl md:text-6xl mt-3 leading-tight">
          For people who read every label.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Member pricing, free shipping, early access. Cancel anytime. No fine
          print.
        </p>
      </div>

      <div className="mt-16 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((p, i) => {
          const isAnnual = p.interval === "YEAR";
          return (
            <div
              key={p.id}
              className={`rounded-3xl p-8 ${
                isAnnual ? "bg-primary text-primary-foreground" : "bg-secondary/50"
              }`}
            >
              <div
                className={`text-xs uppercase tracking-wider ${
                  isAnnual ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {isAnnual ? "Best value — 2 months free" : "Most flexible"}
              </div>
              <h3 className="font-serif text-3xl mt-3">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-serif text-5xl">
                  {formatPrice(p.priceCents)}
                </span>
                <span
                  className={
                    isAnnual
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }
                >
                  /{isAnnual ? "year" : "month"}
                </span>
              </div>
              <ul className="mt-6 space-y-3">
                {perks.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4" /> {b}
                  </li>
                ))}
              </ul>
              <Link
                href={`/account/membership/subscribe?plan=${p.slug}`}
                className={`mt-8 block text-center rounded-full py-3 text-sm font-medium transition ${
                  isAnnual
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                Join
              </Link>
            </div>
          );
        })}
      </div>

      <section className="mt-24 max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl text-center mb-8">
          Membership FAQ
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes. One click in your account dashboard. You keep benefits through the end of your billing period.",
            },
            {
              q: "Does the annual plan auto-renew?",
              a: "Yes, but we email you 14 days before renewal. You can cancel before it charges.",
            },
            {
              q: "Can I share my membership?",
              a: "Memberships are per-person, but household orders to the same shipping address are welcome.",
            },
          ].map((f) => (
            <div key={f.q} className="rounded-xl border border-border p-5">
              <div className="font-medium">{f.q}</div>
              <p className="text-sm text-muted-foreground mt-2">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
