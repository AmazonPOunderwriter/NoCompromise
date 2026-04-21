// src/components/product/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { PublicProduct } from "@/server/products/queries";
import { ShieldCheck } from "lucide-react";

export function ProductCard({ product }: { product: PublicProduct }) {
  const img = product.images[0];
  const topBadges = product.badges.slice(0, 2);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/40 border border-border/60">
        {img ? (
          <Image
            src={img.url}
            alt={img.alt ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground/40">
            <ShieldCheck className="h-12 w-12" />
          </div>
        )}
        {product.compareAtCents && (
          <span className="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-wider">
            Member Price
          </span>
        )}
        <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap max-w-[calc(100%-24px)]">
          {topBadges.map((pb) => (
            <span
              key={pb.badge.id}
              className="rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-medium text-foreground"
            >
              {pb.badge.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {product.brand.name}
        </div>
        <div className="font-medium leading-snug group-hover:text-primary transition-colors">
          {product.title}
        </div>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-medium">{formatPrice(product.priceCents, product.currency)}</span>
          {product.compareAtCents && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAtCents, product.currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
