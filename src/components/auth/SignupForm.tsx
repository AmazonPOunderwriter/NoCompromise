// src/components/auth/SignupForm.tsx
"use client";
import { useState, useTransition } from "react";
import { signupAction } from "@/server/auth/actions";

export function SignupForm() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={(fd) =>
        start(async () => {
          setError(null);
          const result = await signupAction(fd);
          if (result?.error) setError(result.error);
        })
      }
      className="space-y-4"
    >
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <Field name="name" type="text" label="Name" required />
      <Field name="email" type="email" label="Email" required />
      <Field name="password" type="password" label="Password (min 8 chars)" required />
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Creating account..." : "Create account"}
      </button>
      <p className="text-xs text-muted-foreground text-center">
        By signing up, you agree to our Terms and Privacy Policy.
      </p>
    </form>
  );
}

function Field({
  name, type, label, required,
}: {
  name: string; type: string; label: string; required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}
