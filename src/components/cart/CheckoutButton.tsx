// src/components/cart/CheckoutButton.tsx
"use client";
import { useTransition } from "react";
import { createCheckoutSession } from "@/server/orders/checkout";

export function CheckoutButton() {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(() => createCheckoutSession())}
      disabled={pending}
      className="btn-primary w-full !py-3.5"
    >
      {pending ? "Redirecting…" : "Checkout securely"}
    </button>
  );
}
