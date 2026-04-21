// src/app/(shop)/cart/page.tsx
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { getCart } from "@/server/cart/cart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { CheckoutButton } from "@/components/cart/CheckoutButton";
import { CartQtyControls } from "@/components/cart/CartQtyControls";

export const metadata = { title: "Cart" };

export default async function CartPage() {
  const cart = await getCart();
  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (s, i) => s + (i.variant?.priceCents ?? i.product.priceCents) * i.quantity,
    0,
  );
  const shipping = subtotal >= 7500 || subtotal === 0 ? 0 : 795;

  return (
    <>
      <SiteHeader />
      <main className="container-wide py-12">
        <h1 className="font-serif text-4xl mb-10">Your cart</h1>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link href="/shop" className="btn-primary mt-6 inline-flex">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-[1fr_360px] gap-10">
            <div className="space-y-4">
              {items.map((item) => {
                const price = item.variant?.priceCents ?? item.product.priceCents;
                const img = item.product.images[0];
                return (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-border p-4 bg-card"
                  >
                    <div className="h-24 w-24 rounded-lg bg-secondary/40 overflow-hidden relative flex-shrink-0">
                      {img && (
                        <Image
                          src={img.url}
                          alt=""
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground">
                        {item.product.brand.name}
                      </div>
                      <div className="font-medium">{item.product.title}</div>
                      {item.isSubscription && (
                        <div className="chip mt-1">
                          Every {item.subscriptionIntervalDays} days
                        </div>
                      )}
                      <CartQtyControls
                        itemId={item.id}
                        quantity={item.quantity}
                      />
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatPrice(price * item.quantity)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatPrice(price)} ea
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="rounded-2xl border border-border p-6 bg-card h-fit space-y-4 sticky top-24">
              <h2 className="font-serif text-xl">Summary</h2>
              <div className="space-y-2 text-sm">
                <Line label="Subtotal" value={formatPrice(subtotal)} />
                <Line
                  label="Shipping"
                  value={shipping === 0 ? "Free" : formatPrice(shipping)}
                />
                <div className="hairline pt-3 flex justify-between text-base font-medium">
                  <span>Total</span>
                  <span>{formatPrice(subtotal + shipping)}</span>
                </div>
              </div>
              <CheckoutButton />
              <p className="text-xs text-muted-foreground text-center">
                Free shipping on orders over $75 · Secure checkout
              </p>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground tabular-nums">{value}</span>
    </div>
  );
}
