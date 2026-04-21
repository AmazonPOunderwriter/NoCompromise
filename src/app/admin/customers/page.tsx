// src/app/admin/customers/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function AdminCustomersPage() {
  await requireAdmin();
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl">Customers</h1>
      <div className="rounded-2xl border border-border overflow-hidden bg-background">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Email</th>
              <th className="text-left px-5 py-3">Orders</th>
              <th className="text-left px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{c.name ?? "—"}</td>
                <td className="px-5 py-3 text-muted-foreground">{c.email}</td>
                <td className="px-5 py-3">{c._count.orders}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {c.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
