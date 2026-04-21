// src/lib/cart-helpers.ts
// Pure client-safe helpers. No "use server" directive here.

export function cartSubtotal(
  items: {
    quantity: number;
    product: { priceCents: number };
    variant: { priceCents: number | null } | null;
  }[],
): number {
  return items.reduce((sum, item) => {
    const price = item.variant?.priceCents ?? item.product.priceCents;
    return sum + price * item.quantity;
  }, 0);
}
