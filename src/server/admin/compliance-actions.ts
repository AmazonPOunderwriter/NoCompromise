// src/server/admin/compliance-actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitComplianceReview(input: {
  productId: string;
  decision: "APPROVED" | "REJECTED";
  notes: string;
  flagged: string[];
}) {
  const session = await requireAdmin();

  await prisma.$transaction([
    prisma.complianceReview.create({
      data: {
        productId: input.productId,
        reviewerId: session.user.id,
        result: input.decision === "APPROVED" ? "PASS" : "FAIL",
        notes: input.notes,
        flagged: input.flagged,
      },
    }),
    prisma.product.update({
      where: { id: input.productId },
      data: {
        status: input.decision,
        complianceResult: input.decision === "APPROVED" ? "PASS" : "FAIL",
        complianceNotes: input.notes,
        publishedAt: input.decision === "APPROVED" ? new Date() : null,
      },
    }),
  ]);

  revalidatePath("/admin/compliance");
  revalidatePath("/shop");
  redirect("/admin/compliance");
}
