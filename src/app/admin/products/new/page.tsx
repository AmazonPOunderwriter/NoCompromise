// src/app/admin/products/new/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  await requireAdmin();
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-serif text-3xl">New product</h1>
      <p className="text-muted-foreground">
        Enter product details. The compliance engine will automatically scan the
        ingredient list.
      </p>
      <ProductForm brands={brands} categories={categories} />
    </div>
  );
}
