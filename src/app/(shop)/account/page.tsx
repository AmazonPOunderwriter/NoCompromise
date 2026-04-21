// src/app/(shop)/account/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AccountHome() {
  const session = await auth();
  if (!session?.user) return null;

  const [orderCount, subscription] = await Promise.all([
    prisma.order.count({ where: { userId: session.user.id, status: { in: ["PAID", "FULFILLED", "SHIPPED", "DELIVERED"] } } }),
    prisma.userSubscription.findFirst({
      where: { userId: session.user.id, status: { in: ["ACTIVE", "TRIALING"] } },
      include: { plan: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Welcome back
        </div>
        <h1 className="font-serif text-4xl mt-2">{session.user.name ?? "Friend"}</h1>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Orders placed" value={orderCount} />
        <Stat
          label="Membership"
          value={subscription ? "Active" : "Free tier"}
          sub={subscription?.plan.name}
        />
        <Stat label="Email" value={session.user.email ?? ""} small />
      </div>
    </div>
  );
}

function Stat({
  label, value, sub, small,
}: {
  label: string; value: string | number; sub?: string; small?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border p-6 bg-card">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 font-serif ${small ? "text-lg" : "text-3xl"}`}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}
