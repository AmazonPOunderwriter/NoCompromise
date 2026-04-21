// src/app/(marketing)/brand/[slug]/page.tsx
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
  const b = await prisma.brand.findUnique({ where: { slug } });
  return b ? { title: b.name } : {};
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await prisma.brand.findUnique({ where: { slug } });
  if (!brand) notFound();

  const products = await listPublishedProducts({ brandSlug: slug });

  return (
    <div className="container-wide py-12 md:py-16">
      <div className="space-y-4 mb-12 max-w-2xl">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Brand
        </div>
        <h1 className="font-serif text-5xl">{brand.name}</h1>
        {brand.tagline && (
          <p className="text-xl text-muted-foreground">{brand.tagline}</p>
        )}
        {brand.story && (
          <p className="text-foreground/80 leading-relaxed">{brand.story}</p>
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
