// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: "PAID",
              stripePaymentIntentId:
                typeof session.payment_intent === "string" ? session.payment_intent : undefined,
              payments: {
                create: {
                  amountCents: session.amount_total ?? 0,
                  currency: (session.currency ?? "usd").toUpperCase(),
                  status: "SUCCEEDED",
                  stripePaymentIntentId:
                    typeof session.payment_intent === "string" ? session.payment_intent : null,
                },
              },
            },
          });

          // Clear cart
          if (session.customer_email) {
            const user = await prisma.user.findUnique({ where: { email: session.customer_email } });
            if (user) {
              await prisma.cartItem.deleteMany({ where: { cart: { userId: user.id } } });
            }
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customer = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        const user = await prisma.user.findFirst({ where: { stripeCustomerId: customer } });
        if (!user) break;

        const priceId = sub.items.data[0]?.price.id;
        const plan = priceId
          ? await prisma.subscriptionPlan.findFirst({ where: { stripePriceId: priceId } })
          : null;

        await prisma.userSubscription.upsert({
          where: { stripeSubscriptionId: sub.id },
          create: {
            userId: user.id,
            planId: plan?.id ?? "unknown",
            status: mapStripeStatus(sub.status),
            stripeSubscriptionId: sub.id,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
          update: {
            status: mapStripeStatus(sub.status),
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await prisma.userSubscription
          .update({
            where: { stripeSubscriptionId: sub.id },
            data: { status: "CANCELLED" },
          })
          .catch(() => null);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }
}

function mapStripeStatus(s: Stripe.Subscription.Status) {
  switch (s) {
    case "trialing": return "TRIALING" as const;
    case "active": return "ACTIVE" as const;
    case "past_due": return "PAST_DUE" as const;
    case "canceled": return "CANCELLED" as const;
    case "incomplete":
    case "incomplete_expired":
    case "unpaid":
    case "paused":
    default:
      return "INCOMPLETE" as const;
  }
}
