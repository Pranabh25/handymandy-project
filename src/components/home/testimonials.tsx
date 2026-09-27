import Link from "next/link";
import { BadgeCheck, Quote } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { RatingStars } from "@/components/product/rating-stars";
import { db } from "@/lib/db";

async function getFeaturedReviews() {
  const rows = await db.review.findMany({
    where: { status: "APPROVED", rating: 5, product: { status: "ACTIVE" } },
    orderBy: [{ isVerified: "desc" }, { createdAt: "desc" }],
    include: { product: { select: { name: true, slug: true } } },
    take: 12,
  });
  // Prefer substantial reviews, keep it to three.
  return rows.sort((a, b) => b.body.length - a.body.length).slice(0, 3);
}

export async function Testimonials() {
  const reviews = await getFeaturedReviews();
  if (!reviews.length) return null;
  return (
    <section aria-label="Customer reviews" className="container-page py-16 md:py-24">
      <SectionHeading eyebrow="Loved across India" title="Words from our community" align="center" />
      <ul className="grid gap-5 md:grid-cols-3 lg:gap-6">
        {reviews.map((r) => (
          <li key={r.id}>
            <figure className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-soft md:p-7">
              <Quote className="size-6 text-terracotta/60" aria-hidden />
              <RatingStars rating={r.rating} className="mt-4" />
              <blockquote className="mt-3 flex-1">
                <p className="font-display text-xl leading-snug font-semibold">{r.title}</p>
                <p className="mt-2 line-clamp-5 text-sm leading-6 text-muted-foreground">{r.body}</p>
              </blockquote>
              <figcaption className="mt-6 border-t pt-4 text-sm">
                <span className="flex items-center gap-1.5 font-semibold">
                  {r.authorName}
                  {r.isVerified ? <BadgeCheck className="size-4 text-sage" aria-label="Verified buyer" /> : null}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {r.city ? `${r.city} · ` : ""}on{" "}
                  <Link href={`/product/${r.product.slug}`} className="underline-offset-4 hover:text-foreground hover:underline">
                    {r.product.name}
                  </Link>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
