// src/app/(auth)/login/page.tsx
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl">Welcome back.</h1>
        <p className="text-sm text-muted-foreground">
          Log in to shop, manage subscriptions, and track orders.
        </p>
      </div>
      <LoginForm />
      <p className="text-sm text-center text-muted-foreground">
        New here?{" "}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
