// src/app/(marketing)/product/[slug]/page.tsx
import { getProductBySlug, getRelatedProducts } from "@/server/products/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ShieldCheck, Check, X } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { BANNED_INGREDIENTS } from "@/server/compliance/rules";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.seoDescription ?? p.description.slice(0, 160),
    openGraph: { images: p.images[0] ? [p.images[0].url] : [] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id);

  return (
    <div className="container-wide py-10 md:py-16">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/40 relative">
            {product.images[0] && (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt ?? product.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.slice(1, 5).map((img) => (
                <div
                  key={img.id}
                  className="aspect-square rounded-lg overflow-hidden bg-secondary/40 relative"
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? ""}
                    fill
                    sizes="12vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-7">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {product.brand.name}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl mt-2 leading-tight">
              {product.title}
            </h1>
            {product.subtitle && (
              <p className="text-muted-foreground mt-2">{product.subtitle}</p>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-serif">{formatPrice(product.priceCents)}</span>
            {product.compareAtCents && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compareAtCents)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {product.badges.map((pb) => (
              <span key={pb.badge.id} className="chip">
                <ShieldCheck className="h-3 w-3 text-primary" />
                {pb.badge.name}
              </span>
            ))}
          </div>

          <p className="text-foreground/80 leading-relaxed">{product.description}</p>

          <AddToCartButton
            productId={product.id}
            subscriptionOptions={product.subscriptionOptions}
          />

          {product.whyItPassed && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-3">
              <div className="flex items-center gap-2 font-medium text-primary">
                <ShieldCheck className="h-4 w-4" /> Why this passed our standard
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {product.whyItPassed}
              </p>
            </div>
          )}

          <div className="hairline pt-7">
            <h3 className="font-serif text-xl mb-4">Ingredients</h3>
            <ul className="space-y-2">
              {product.ingredients.map((pi) => (
                <li key={pi.ingredientId} className="flex items-start gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">{pi.ingredient.name}</span>
                    {pi.notes && (
                      <span className="text-muted-foreground"> — {pi.notes}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="hairline pt-7">
            <h3 className="font-serif text-xl mb-2">
              What we banned so this could list
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Typical grocery-store equivalents often contain:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {BANNED_INGREDIENTS.slice(0, 6).map((b) => (
                <div
                  key={b.key}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5 text-destructive" />
                  {b.displayName}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-3xl mb-8">You might also love</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
