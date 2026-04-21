// src/app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [products, pending, orders, revenue, customers] = await Promise.all([
    prisma.product.count({ where: { status: "APPROVED" } }),
    prisma.product.count({ where: { status: { in: ["DRAFT", "UNDER_REVIEW"] } } }),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { totalCents: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
  ]);

  const stats = [
    { label: "Live Products", value: products },
    { label: "Awaiting Review", value: pending, accent: true, href: "/admin/compliance" },
    { label: "Paid Orders", value: orders },
    { label: "Revenue", value: `$${((revenue._sum.totalCents ?? 0) / 100).toFixed(2)}` },
    { label: "Customers", value: customers },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          An overview of your store.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => {
          const card = (
            <div
              className={`rounded-2xl border p-6 bg-background transition ${
                s.accent ? "border-amber-300" : "border-border"
              } ${s.href ? "hover:border-primary/40" : ""}`}
            >
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-2 font-serif text-3xl">{s.value}</div>
            </div>
          );
          return s.href ? (
            <Link key={s.label} href={s.href}>
              {card}
            </Link>
          ) : (
            <div key={s.label}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
