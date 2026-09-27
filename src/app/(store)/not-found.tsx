import { NotFoundContent } from "@/components/content/not-found-content";

/** Shown when a storefront page calls notFound() (e.g. an unknown product slug) — keeps the store header/footer. */
export default function StoreNotFound() {
  return <NotFoundContent />;
}
