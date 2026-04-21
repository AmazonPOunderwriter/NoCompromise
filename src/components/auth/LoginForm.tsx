// src/components/auth/LoginForm.tsx
"use client";
import { useState, useTransition } from "react";
import { loginAction } from "@/server/auth/actions";

export function LoginForm() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={(fd) =>
        start(async () => {
          setError(null);
          const result = await loginAction(fd);
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
      <Field name="email" type="email" label="Email" required />
      <Field name="password" type="password" label="Password" required />
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Logging in..." : "Log in"}
      </button>
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
