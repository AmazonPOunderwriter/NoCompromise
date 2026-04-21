// src/app/(shop)/account/orders/[id]/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;
  const { id } = await params;
  const { success } = await searchParams;

  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  return (
    <div className="space-y-6">
      {success && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <div className="font-medium">Thank you for your order.</div>
            <p className="text-sm text-muted-foreground mt-1">
              A confirmation is on its way to your inbox.
            </p>
          </div>
        </div>
      )}

      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">
          Order
        </div>
        <h1 className="font-serif text-3xl mt-1">{order.orderNumber}</h1>
        <div className="text-sm text-muted-foreground mt-2">
          {order.createdAt.toLocaleDateString()} · {order.status}
        </div>
      </div>

      <div className="rounded-2xl border border-border divide-y divide-border">
        {order.items.map((item) => (
          <div key={item.id} className="p-5 flex justify-between gap-4">
            <div>
              <div className="font-medium">{item.titleSnapshot}</div>
              <div className="text-sm text-muted-foreground">
                Qty {item.quantity}
              </div>
            </div>
            <div className="font-medium">
              {formatPrice(item.priceCents * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border p-6 space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span><span>{formatPrice(order.subtotalCents)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping</span>
          <span>{order.shippingCents === 0 ? "Free" : formatPrice(order.shippingCents)}</span>
        </div>
        <div className="hairline pt-3 flex justify-between text-base font-medium">
          <span>Total</span><span>{formatPrice(order.totalCents)}</span>
        </div>
      </div>
    </div>
  );
}
