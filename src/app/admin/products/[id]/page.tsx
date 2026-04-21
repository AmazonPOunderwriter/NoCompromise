// src/app/admin/products/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        categories: true,
      },
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl">Edit product</h1>
        <p className="text-muted-foreground mt-1">{product.title}</p>
      </div>
      <ProductForm brands={brands} categories={categories} product={product} />
    </div>
  );
}
