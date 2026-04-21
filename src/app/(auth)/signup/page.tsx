// src/app/(auth)/signup/page.tsx
import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl">Create your account.</h1>
        <p className="text-sm text-muted-foreground">
          Shop curated brands that pass our standard.
        </p>
      </div>
      <SignupForm />
      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
