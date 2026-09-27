import Link from "next/link";
import { BadgeCheck, MessageSquareText } from "lucide-react";
import { RatingStars } from "@/components/product/rating-stars";
import { buttonVariants } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { ReviewForm } from "./review-form";

type Review = {
  id: string;
  authorName: string;
  city: string | null;
  rating: number;
  title: string;
  body: string;
  isVerified: boolean;
  createdAt: Date;
};

type Props = {
  productId: string;
  productSlug: string;
  rating: number;
  reviewCount: number;
  breakdown: Record<number, number>;
  reviews: Review[];
  isLoggedIn: boolean;
};

export function ReviewsSection({ productId, productSlug, rating, reviewCount, breakdown, reviews, isLoggedIn }: Props) {
  const totalInBreakdown = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const count = Math.max(reviewCount, totalInBreakdown);

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-28">
      <div className="grid gap-10 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-16">
        <div>
          <p className="eyebrow mb-2">Reviews</p>
          <h2 id="reviews-title" className="text-3xl font-semibold md:text-4xl">
            What customers say
          </h2>
          {count > 0 ? (
            <div className="mt-6">
              <div className="flex items-end gap-3">
                <span className="font-display text-6xl leading-none font-semibold tabular-nums">{rating.toFixed(1)}</span>
                <div className="pb-1">
                  <RatingStars rating={rating} size="md" />
                  <p className="mt-1 text-xs text-muted-foreground">Based on {count.toLocaleString("en-IN")} {count === 1 ? "review" : "reviews"}</p>
                </div>
              </div>
              <ul className="mt-6 space-y-2" aria-label="Rating breakdown">
                {[5, 4, 3, 2, 1].map((star) => {
                  const n = breakdown[star] ?? 0;
                  const pct = totalInBreakdown ? Math.round((n / totalInBreakdown) * 100) : 0;
                  return (
                    <li key={star} className="flex items-center gap-3 text-xs">
                      <span className="w-8 shrink-0 tabular-nums">{star} ★</span>
                      <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden>
                        <span className="absolute inset-y-0 left-0 rounded-full bg-gold" style={{ width: `${pct}%` }} />
                      </span>
                      <span className="w-9 shrink-0 text-right text-muted-foreground tabular-nums">{pct}%</span>
                      <span className="sr-only">
                        {n} {n === 1 ? "review" : "reviews"} with {star} stars
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">No reviews yet — be the first to share your experience.</p>
          )}

          <div className="mt-8">
            {isLoggedIn ? (
              <div className="hidden lg:block">
                <ReviewForm productId={productId} />
              </div>
            ) : (
              <div className="rounded-xl border bg-card p-5">
                <p className="text-sm leading-6 text-muted-foreground">Bought this? We&apos;d love to hear from you.</p>
                <Link
                  href={`/login?next=${encodeURIComponent(`/product/${productSlug}`)}`}
                  className={buttonVariants({ variant: "outline", className: "mt-3" })}
                >
                  Log in to write a review
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0">
          {isLoggedIn ? (
            <div className="mb-8 lg:hidden">
              <ReviewForm productId={productId} />
            </div>
          ) : null}
          {reviews.length ? (
            <ul className="divide-y border-y">
              {reviews.map((r) => (
                <li key={r.id} className="py-6">
                  <article>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <RatingStars rating={r.rating} />
                      <time dateTime={r.createdAt.toISOString()} className="text-xs text-muted-foreground">
                        {formatDate(r.createdAt)}
                      </time>
                    </div>
                    <h3 className="mt-2.5 font-sans text-base font-semibold">{r.title}</h3>
                    <p className="mt-1.5 text-sm leading-7 whitespace-pre-line text-foreground/80">{r.body}</p>
                    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{r.authorName}</span>
                      {r.city ? <span>· {r.city}</span> : null}
                      {r.isVerified ? (
                        <span className="inline-flex items-center gap-1 font-medium text-sage">
                          <BadgeCheck className="size-3.5" aria-hidden /> Verified buyer
                        </span>
                      ) : null}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-dashed bg-card/60 px-6 py-14 text-center">
              <MessageSquareText className="size-8 text-terracotta" strokeWidth={1.5} aria-hidden />
              <p className="mt-3 font-display text-xl font-semibold">No reviews yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Your review could help someone choose the perfect gift.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
