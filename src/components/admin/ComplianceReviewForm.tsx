// src/components/admin/ComplianceReviewForm.tsx
"use client";
import { useTransition } from "react";
import { submitComplianceReview } from "@/server/admin/compliance-actions";

export function ComplianceReviewForm({
  productId,
  suggested,
  flagged,
}: {
  productId: string;
  suggested: "PASS" | "FAIL" | "NEEDS_REVIEW";
  flagged: string[];
}) {
  const [pending, start] = useTransition();

  return (
    <form
      action={(fd) =>
        start(async () => {
          await submitComplianceReview({
            productId,
            decision: fd.get("decision") as "APPROVED" | "REJECTED",
            notes: String(fd.get("notes") ?? ""),
            flagged,
          });
        })
      }
      className="rounded-2xl border border-border p-6 space-y-4 bg-background"
    >
      <h2 className="font-serif text-xl">Reviewer decision</h2>
      <p className="text-sm text-muted-foreground">
        Automated verdict suggests:{" "}
        <span className="font-medium text-foreground">{suggested}</span>. Override
        as needed.
      </p>
      <textarea
        name="notes"
        rows={4}
        placeholder="Review notes (visible internally)…"
        className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="flex gap-3">
        <button
          name="decision"
          value="REJECTED"
          disabled={pending}
          className="rounded-full border border-destructive/40 text-destructive px-5 py-2 text-sm hover:bg-destructive/5"
        >
          Reject
        </button>
        <button
          name="decision"
          value="APPROVED"
          disabled={pending}
          className="btn-primary"
        >
          Approve &amp; publish
        </button>
      </div>
    </form>
  );
}
