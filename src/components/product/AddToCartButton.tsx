// src/components/product/AddToCartButton.tsx
"use client";
import { useState, useTransition } from "react";
import { addToCart } from "@/server/cart/cart";
import { ShoppingBag, Check } from "lucide-react";

interface SubOption {
  id: string;
  intervalDays: number;
  discountPercent: number;
}

export function AddToCartButton({
  productId,
  subscriptionOptions,
}: {
  productId: string;
  subscriptionOptions: SubOption[];
}) {
  const [pending, start] = useTransition();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [subscribe, setSubscribe] = useState(false);
  const [intervalDays, setIntervalDays] = useState(
    subscriptionOptions[0]?.intervalDays ?? 30,
  );

  const handle = () =>
    start(async () => {
      await addToCart({
        productId,
        quantity: qty,
        isSubscription: subscribe,
        intervalDays: subscribe ? intervalDays : undefined,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    });

  return (
    <div className="space-y-4">
      {subscriptionOptions.length > 0 && (
        <div className="rounded-xl border border-border p-4 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              checked={!subscribe}
              onChange={() => setSubscribe(false)}
              className="mt-1 accent-primary"
            />
            <div>
              <div className="font-medium text-sm">One-time purchase</div>
              <div className="text-xs text-muted-foreground">Standard shipping</div>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              checked={subscribe}
              onChange={() => setSubscribe(true)}
              className="mt-1 accent-primary"
            />
            <div className="flex-1">
              <div className="font-medium text-sm flex items-center gap-2">
                Subscribe & save {subscriptionOptions[0].discountPercent}%
                <span className="chip !text-[10px] !py-0.5">Autoship</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Delivered on your schedule — cancel anytime
              </div>
              {subscribe && (
                <select
                  value={intervalDays}
                  onChange={(e) => setIntervalDays(Number(e.target.value))}
                  className="mt-2 rounded-full border border-border px-3 py-1.5 text-xs bg-background"
                >
                  {subscriptionOptions.map((o) => (
                    <option key={o.id} value={o.intervalDays}>
                      Every {o.intervalDays} days
                    </option>
                  ))}
                </select>
              )}
            </div>
          </label>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-border">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="px-3 py-2 text-sm"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="px-3 tabular-nums text-sm">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="px-3 py-2 text-sm"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          onClick={handle}
          disabled={pending}
          className="btn-primary flex-1 !py-3.5"
        >
          {added ? (
            <>
              <Check className="h-4 w-4" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" /> Add to cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
