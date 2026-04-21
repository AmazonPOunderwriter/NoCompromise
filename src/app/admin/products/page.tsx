// src/app/admin/products/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    include: { brand: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl">Products</h1>
          <p className="text-muted-foreground mt-1">
            {products.length} total product{products.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + New product
        </Link>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden bg-background">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3">Product</th>
              <th className="text-left px-5 py-3">Brand</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Price</th>
              <th className="text-left px-5 py-3">Inventory</th>
              <th className="text-right px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border last:border-0 hover:bg-secondary/30"
              >
                <td className="px-5 py-3 font-medium">{p.title}</td>
                <td className="px-5 py-3 text-muted-foreground">{p.brand.name}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      p.status === "APPROVED"
                        ? "bg-primary/10 text-primary"
                        : p.status === "REJECTED"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {p.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-5 py-3">{formatPrice(p.priceCents)}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {p.inventoryQty}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
