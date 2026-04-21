// src/server/cart/cart.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

const CART_COOKIE = "nc_cart_session";

async function getOrCreateCartId(): Promise<string> {
  const session = await auth();
  const cookieStore = await cookies();

  if (session?.user?.id) {
    const existing = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });
    if (existing) return existing.id;
    const created = await prisma.cart.create({ data: { userId: session.user.id } });
    return created.id;
  }

  const sid = cookieStore.get(CART_COOKIE)?.value;
  if (sid) {
    const existing = await prisma.cart.findUnique({ where: { sessionId: sid } });
    if (existing) return existing.id;
  }

  const newSid = randomUUID();
  cookieStore.set(CART_COOKIE, newSid, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
  const created = await prisma.cart.create({ data: { sessionId: newSid } });
  return created.id;
}

export async function getCart() {
  const cartId = await getOrCreateCartId();
  return prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          product: {
            include: { images: { orderBy: { sortOrder: "asc" }, take: 1 }, brand: true },
          },
          variant: true,
        },
      },
    },
  });
}

export async function addToCart(input: {
  productId: string;
  variantId?: string;
  quantity?: number;
  isSubscription?: boolean;
  intervalDays?: number;
}) {
  const cartId = await getOrCreateCartId();
  const qty = input.quantity ?? 1;

  const product = await prisma.product.findUnique({ where: { id: input.productId } });
  if (!product || product.status !== "APPROVED") {
    throw new Error("Product not available.");
  }

  const existing = await prisma.cartItem.findUnique({
    where: {
      cartId_productId_variantId: {
        cartId,
        productId: input.productId,
        variantId: input.variantId ?? null as unknown as string,
      },
    },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + qty },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId,
        productId: input.productId,
        variantId: input.variantId,
        quantity: qty,
        isSubscription: input.isSubscription ?? false,
        subscriptionIntervalDays: input.intervalDays ?? null,
      },
    });
  }

  revalidatePath("/cart");
}

export async function updateCartItem(itemId: string, quantity: number) {
  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }
  revalidatePath("/cart");
}

export async function removeCartItem(itemId: string) {
  await prisma.cartItem.delete({ where: { id: itemId } });
  revalidatePath("/cart");
}

export async function mergeGuestCartIntoUser(userId: string) {
  const cookieStore = await cookies();
  const sid = cookieStore.get(CART_COOKIE)?.value;
  if (!sid) return;

  const guest = await prisma.cart.findUnique({
    where: { sessionId: sid },
    include: { items: true },
  });
  if (!guest || guest.items.length === 0) return;

  const userCart = await prisma.cart.upsert({
    where: { id: guest.id },
    update: { userId, sessionId: null },
    create: { userId },
  });

  cookieStore.delete(CART_COOKIE);
  return userCart;
}
