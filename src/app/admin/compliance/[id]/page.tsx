// src/app/admin/compliance/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { evaluateCompliance } from "@/server/compliance/engine";
import { notFound } from "next/navigation";
import { ComplianceReviewForm } from "@/components/admin/ComplianceReviewForm";
import { AlertTriangle, X, Check } from "lucide-react";

export default async function ComplianceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { brand: true, ingredients: { include: { ingredient: true } } },
  });
  if (!product) notFound();

  const report = evaluateCompliance(product.rawIngredientsText ?? "");

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Compliance review
        </div>
        <h1 className="font-serif text-3xl mt-2">{product.title}</h1>
        <p className="text-muted-foreground">{product.brand.name}</p>
      </div>

      <div
        className={`rounded-2xl border p-6 ${
          report.result === "PASS"
            ? "border-primary/30 bg-primary/5"
            : report.result === "FAIL"
              ? "border-destructive/30 bg-destructive/5"
              : "border-amber-300 bg-amber-50"
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          {report.result === "PASS" ? (
            <Check className="h-5 w-5 text-primary" />
          ) : report.result === "FAIL" ? (
            <X className="h-5 w-5 text-destructive" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-700" />
          )}
          <span className="font-serif text-xl">
            Automated verdict: {report.result.replace("_", " ")}
          </span>
        </div>
        <p className="text-sm">{report.summary}</p>
      </div>

      {(report.banned.length > 0 || report.caution.length > 0) && (
        <div className="space-y-4">
          <h2 className="font-serif text-xl">Flagged</h2>
          {report.banned.map((f) => (
            <div
              key={f.rule.key}
              className="rounded-xl border border-destructive/30 bg-destructive/5 p-4"
            >
              <div className="flex items-center gap-2 font-medium text-destructive">
                <X className="h-4 w-4" /> {f.rule.displayName} — BANNED
              </div>
              <p className="text-sm mt-1 text-muted-foreground">{f.rule.rationale}</p>
              <p className="text-xs mt-2 font-mono bg-background rounded px-2 py-1 inline-block">
                &quot;{f.context}&quot;
              </p>
            </div>
          ))}
          {report.caution.map((f) => (
            <div
              key={f.rule.key}
              className="rounded-xl border border-amber-300 bg-amber-50 p-4"
            >
              <div className="flex items-center gap-2 font-medium text-amber-900">
                <AlertTriangle className="h-4 w-4" /> {f.rule.displayName} — CAUTION
              </div>
              <p className="text-sm mt-1 text-muted-foreground">{f.rule.rationale}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="font-serif text-xl mb-2">Submitted ingredient text</h2>
        <div className="rounded-xl bg-secondary/50 p-4 text-sm font-mono leading-relaxed">
          {product.rawIngredientsText ?? "—"}
        </div>
      </div>

      <ComplianceReviewForm
        productId={product.id}
        suggested={report.result}
        flagged={[...report.banned, ...report.caution].map((f) => f.rule.key)}
      />
    </div>
  );
}
