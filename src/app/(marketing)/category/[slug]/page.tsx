// src/app/(marketing)/category/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { listPublishedProducts } from "@/server/products/queries";
import { ProductCard } from "@/components/product/ProductCard";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  return cat ? { title: cat.name } : {};
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const products = await listPublishedProducts({ categorySlug: slug });

  return (
    <div className="container-wide py-12 md:py-16">
      <div className="space-y-3 mb-10">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Category
        </div>
        <h1 className="font-serif text-5xl">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground max-w-2xl">{category.description}</p>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
