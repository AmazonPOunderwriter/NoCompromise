// src/app/admin/brands/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function AdminBrandsPage() {
  await requireAdmin();
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl">Brands</h1>
      <div className="rounded-2xl border border-border overflow-hidden bg-background">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3">Brand</th>
              <th className="text-left px-5 py-3">Tagline</th>
              <th className="text-left px-5 py-3">Products</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{b.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{b.tagline}</td>
                <td className="px-5 py-3">{b._count.products}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
