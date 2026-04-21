// src/components/cart/CartQtyControls.tsx
"use client";
import { useTransition } from "react";
import { updateCartItem, removeCartItem } from "@/server/cart/cart";

export function CartQtyControls({
  itemId,
  quantity,
}: {
  itemId: string;
  quantity: number;
}) {
  const [, start] = useTransition();
  return (
    <div className="flex items-center gap-3 mt-2">
      <div className="flex items-center rounded-full border border-border text-sm">
        <button
          onClick={() =>
            start(() => updateCartItem(itemId, Math.max(1, quantity - 1)))
          }
          className="px-2.5 py-1"
          aria-label="Decrease"
        >
          −
        </button>
        <span className="px-2 tabular-nums">{quantity}</span>
        <button
          onClick={() => start(() => updateCartItem(itemId, quantity + 1))}
          className="px-2.5 py-1"
          aria-label="Increase"
        >
          +
        </button>
      </div>
      <button
        onClick={() => start(() => removeCartItem(itemId))}
        className="text-xs text-muted-foreground hover:text-destructive transition"
      >
        Remove
      </button>
    </div>
  );
}
