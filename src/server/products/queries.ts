// src/server/products/queries.ts
// ALL public product queries go through these helpers.
// Storefront code never touches prisma.product directly — this enforces
// "only APPROVED products are visible" at the query boundary.

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

const publicWhere = (extra?: Prisma.ProductWhereInput): Prisma.ProductWhereInput => ({
  status: "APPROVED",
  publishedAt: { not: null, lte: new Date() },
  ...(extra ?? {}),
});

const publicInclude = {
  brand: true,
  images: { orderBy: { sortOrder: "asc" } },
  badges: { include: { badge: true } },
  categories: { include: { category: true } },
  ingredients: { include: { ingredient: true }, orderBy: { position: "asc" } },
  subscriptionOptions: { where: { isActive: true } },
} satisfies Prisma.ProductInclude;

export type PublicProduct = Prisma.ProductGetPayload<{ include: typeof publicInclude }>;

export async function listPublishedProducts(opts?: {
  categorySlug?: string;
  brandSlug?: string;
  badgeSlugs?: string[];
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "featured";
  take?: number;
  skip?: number;
}): Promise<PublicProduct[]> {
  const where: Prisma.ProductWhereInput = {};
  if (opts?.categorySlug) {
    where.categories = { some: { category: { slug: opts.categorySlug } } };
  }
  if (opts?.brandSlug) {
    where.brand = { slug: opts.brandSlug };
  }
  if (opts?.badgeSlugs?.length) {
    where.badges = { some: { badge: { slug: { in: opts.badgeSlugs } } } };
  }
  if (opts?.search) {
    where.OR = [
      { title: { contains: opts.search, mode: "insensitive" } },
      { description: { contains: opts.search, mode: "insensitive" } },
      { brand: { name: { contains: opts.search, mode: "insensitive" } } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    opts?.sort === "price_asc"
      ? { priceCents: "asc" }
      : opts?.sort === "price_desc"
        ? { priceCents: "desc" }
        : opts?.sort === "featured"
          ? { isFeatured: "desc" }
          : { publishedAt: "desc" };

  return prisma.product.findMany({
    where: publicWhere(where),
    include: publicInclude,
    orderBy,
    take: opts?.take ?? 48,
    skip: opts?.skip ?? 0,
  });
}

export async function getProductBySlug(slug: string): Promise<PublicProduct | null> {
  return prisma.product.findFirst({
    where: publicWhere({ slug }),
    include: publicInclude,
  });
}

export async function getFeaturedProducts(take = 8): Promise<PublicProduct[]> {
  return prisma.product.findMany({
    where: publicWhere({ isFeatured: true }),
    include: publicInclude,
    take,
  });
}

export async function getStaffPicks(take = 6): Promise<PublicProduct[]> {
  return prisma.product.findMany({
    where: publicWhere({ isStaffPick: true }),
    include: publicInclude,
    take,
  });
}

export async function getNewArrivals(take = 8): Promise<PublicProduct[]> {
  return prisma.product.findMany({
    where: publicWhere({ isNewArrival: true }),
    include: publicInclude,
    take,
    orderBy: { publishedAt: "desc" },
  });
}

export async function getRelatedProducts(productId: string, take = 4): Promise<PublicProduct[]> {
  // Simple version: same category, excluding the product itself.
  const categories = await prisma.productCategory.findMany({
    where: { productId },
    select: { categoryId: true },
  });
  if (categories.length === 0) return [];

  return prisma.product.findMany({
    where: publicWhere({
      id: { not: productId },
      categories: { some: { categoryId: { in: categories.map((c) => c.categoryId) } } },
    }),
    include: publicInclude,
    take,
  });
}
