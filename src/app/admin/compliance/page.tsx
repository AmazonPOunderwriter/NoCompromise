// src/app/admin/compliance/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";

export default async function CompliancePage() {
  await requireAdmin();

  const queue = await prisma.product.findMany({
    where: { status: { in: ["DRAFT", "UNDER_REVIEW", "REJECTED"] } },
    include: {
      brand: true,
      complianceReviews: { take: 1, orderBy: { createdAt: "desc" } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl">Compliance Review Queue</h1>
        <p className="text-muted-foreground mt-1">
          {queue.length} product{queue.length === 1 ? "" : "s"} awaiting review
        </p>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden bg-background">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3">Product</th>
              <th className="text-left px-5 py-3">Brand</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Last Review</th>
              <th className="text-right px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {queue.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                <td className="px-5 py-4 font-medium">{p.title}</td>
                <td className="px-5 py-4 text-muted-foreground">{p.brand.name}</td>
                <td className="px-5 py-4">
                  <StatusChip status={p.status} />
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {p.complianceReviews[0]?.createdAt.toLocaleDateString() ?? "—"}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/compliance/${p.id}`}
                    className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
            {queue.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted-foreground py-12">
                  All products reviewed. Nothing in the queue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    DRAFT: "bg-muted text-muted-foreground",
    UNDER_REVIEW: "bg-amber-100 text-amber-900",
    APPROVED: "bg-primary/10 text-primary",
    REJECTED: "bg-destructive/10 text-destructive",
    ARCHIVED: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs ${map[status] ?? ""}`}>
      {status.replace("_", " ")}
    </span>
  );
}
