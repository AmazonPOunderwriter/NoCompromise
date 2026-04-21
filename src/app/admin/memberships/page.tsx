// src/app/admin/memberships/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

export default async function AdminMembershipsPage() {
  await requireAdmin();
  const [plans, activeSubs] = await Promise.all([
    prisma.subscriptionPlan.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.userSubscription.count({
      where: { status: { in: ["ACTIVE", "TRIALING"] } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Memberships</h1>
        <p className="text-muted-foreground mt-1">
          {activeSubs} active member{activeSubs === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {plans.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border p-6 bg-background">
            <div className="font-medium">{p.name}</div>
            <div className="text-2xl font-serif mt-2">
              {formatPrice(p.priceCents)}{" "}
              <span className="text-sm text-muted-foreground">
                /{p.interval.toLowerCase()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{p.description}</p>
            <div className="mt-4 text-xs text-muted-foreground">
              Stripe price ID: {p.stripePriceId ?? "not configured"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
