// src/app/admin/orders/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, user: true },
    take: 50,
  });

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl">Orders</h1>
      <div className="rounded-2xl border border-border overflow-hidden bg-background">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3">Order #</th>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Items</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Total</th>
              <th className="text-left px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{o.orderNumber}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {o.user?.email ?? o.email}
                </td>
                <td className="px-5 py-3">{o.items.length}</td>
                <td className="px-5 py-3">
                  <span className="chip">{o.status}</span>
                </td>
                <td className="px-5 py-3">{formatPrice(o.totalCents)}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {o.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
