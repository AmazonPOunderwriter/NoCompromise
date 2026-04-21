// src/server/admin/product-actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { evaluateCompliance } from "@/server/compliance/engine";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveProduct(input: {
  id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  whyItPassed?: string;
  brandId: string;
  priceCents: number;
  inventoryQty: number;
  rawIngredientsText: string;
  categoryIds: string[];
  imageUrl?: string;
  isFeatured?: boolean;
  isStaffPick?: boolean;
}) {
  await requireAdmin();

  const report = evaluateCompliance(input.rawIngredientsText);
  const status =
    report.result === "PASS"
      ? "APPROVED"
      : report.result === "FAIL"
        ? "REJECTED"
        : "UNDER_REVIEW";

  const data = {
    title: input.title,
    slug: input.slug,
    subtitle: input.subtitle ?? null,
    description: input.description,
    whyItPassed: input.whyItPassed ?? null,
    brandId: input.brandId,
    priceCents: input.priceCents,
    inventoryQty: input.inventoryQty,
    rawIngredientsText: input.rawIngredientsText,
    complianceResult: report.result,
    complianceNotes: report.summary,
    status: status as "APPROVED" | "REJECTED" | "UNDER_REVIEW",
    publishedAt: status === "APPROVED" ? new Date() : null,
    isFeatured: input.isFeatured ?? false,
    isStaffPick: input.isStaffPick ?? false,
  };

  const product = input.id
    ? await prisma.product.update({ where: { id: input.id }, data })
    : await prisma.product.create({ data });

  // Replace category links
  await prisma.productCategory.deleteMany({ where: { productId: product.id } });
  if (input.categoryIds.length) {
    await prisma.productCategory.createMany({
      data: input.categoryIds.map((categoryId) => ({
        productId: product.id,
        categoryId,
      })),
    });
  }

  // Replace image (simple single-image MVP)
  if (input.imageUrl) {
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: { productId: product.id, url: input.imageUrl, alt: input.title, sortOrder: 0 },
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect(`/admin/products/${product.id}`);
}
