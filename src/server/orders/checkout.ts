// src/server/orders/checkout.ts
"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { getCart } from "@/server/cart/cart";
   import { cartSubtotal } from "@/lib/cart-helpers";
import { generateOrderNumber } from "@/lib/utils";
import { redirect } from "next/navigation";

const FREE_SHIPPING_THRESHOLD_CENTS = 7500;
const FLAT_SHIPPING_CENTS = 795;

export async function createCheckoutSession() {
  const cart = await getCart();
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty.");
  }

  const session = await auth();
  const subtotal = cartSubtotal(cart.items);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS;
  const total = subtotal + shipping;

  // Create order in PENDING state
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session?.user?.id,
      email: session?.user?.email ?? "guest@checkout",
      status: "PENDING",
      subtotalCents: subtotal,
      shippingCents: shipping,
      totalCents: total,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          titleSnapshot: item.product.title,
          priceCents: item.variant?.priceCents ?? item.product.priceCents,
          quantity: item.quantity,
        })),
      },
    },
  });

  // Build Stripe line items
  const line_items = cart.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.product.title,
        description: item.product.brand.name,
        images: item.product.images[0] ? [item.product.images[0].url] : undefined,
      },
      unit_amount: item.variant?.priceCents ?? item.product.priceCents,
      recurring: item.isSubscription
        ? {
            interval: "day" as const,
            interval_count: item.subscriptionIntervalDays ?? 30,
          }
        : undefined,
    },
    quantity: item.quantity,
  }));

  const hasSubscription = cart.items.some((i) => i.isSubscription);

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: hasSubscription ? "subscription" : "payment",
    payment_method_types: ["card"],
    line_items,
    customer_email: session?.user?.email ?? undefined,
    success_url: `${origin}/account/orders/${order.id}?success=1`,
    cancel_url: `${origin}/cart`,
    metadata: { orderId: order.id },
    shipping_address_collection: hasSubscription
      ? undefined
      : { allowed_countries: ["US", "CA"] },
    shipping_options: hasSubscription
      ? undefined
      : [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: shipping, currency: "usd" },
              display_name: shipping === 0 ? "Free Shipping" : "Standard Shipping",
            },
          },
        ],
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: checkoutSession.id },
  });

  if (!checkoutSession.url) throw new Error("Stripe session has no URL");
  redirect(checkoutSession.url);
}
