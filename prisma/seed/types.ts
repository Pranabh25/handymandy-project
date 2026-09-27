import type { Prisma } from "../../src/generated/prisma/client";

/** Product seed shape: category by slug; rating/reviewCount are derived from approved reviews. */
export type SeedProduct = Omit<
  Prisma.ProductCreateManyInput,
  "id" | "categoryId" | "rating" | "reviewCount" | "createdAt" | "updatedAt"
> & { categorySlug: string };

export const LUSHAURA_MFR = "LushAura Lifestyle Pvt. Ltd., Bengaluru";
