// src/app/(shop)/account/orders/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl">Orders</h1>
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No orders yet.</p>
          <Link href="/shop" className="btn-primary mt-6 inline-flex">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/account/orders/${o.id}`}
              className="block rounded-xl border border-border p-5 hover:border-primary/40 transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="font-medium">{o.orderNumber}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {o.createdAt.toLocaleDateString()} · {o.items.length} item
                    {o.items.length === 1 ? "" : "s"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatPrice(o.totalCents)}</div>
                  <div className="text-xs text-muted-foreground mt-1">{o.status}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
