"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS_META } from "@/lib/order-status";
import { NativeSelect } from "./list-controls";

type Params = Record<string, string | undefined>;

const RANGE_LABEL: Record<string, string> = { "7": "Last 7 days", "30": "Last 30 days", "90": "Last 90 days" };

/**
 * Search + dropdown filters for list pages. Each change pushes new searchParams;
 * the server page re-renders with the filtered data.
 */
export function OrdersFilters({
  params,
  showSearch = true,
  showRange = true,
  statusKey = "pay",
}: {
  params: Params;
  showSearch?: boolean;
  showRange?: boolean;
  /** searchParam used for the payment-status select (`pay` on orders, `status` on payments). */
  statusKey?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.q ?? "");

  function push(overrides: Params) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...params, page: undefined, ...overrides })) if (v) qs.set(k, v);
    const s = qs.toString();
    startTransition(() => router.push(s ? `${pathname}?${s}` : pathname, { scroll: false }));
  }

  const hasFilters = Boolean(params.q || params.method || params[statusKey] || params.range);

  return (
    <div className="flex flex-col gap-2 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:px-5">
      {showSearch ? (
        <form
          role="search"
          className="relative flex-1 sm:min-w-64"
          onSubmit={(e) => {
            e.preventDefault();
            push({ q: q.trim() || undefined });
          }}
        >
          <label htmlFor="order-search" className="sr-only">
            Search orders
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            id="order-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Order no., customer name or phone"
            className="h-9 pl-9"
          />
        </form>
      ) : null}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <label className="sr-only" htmlFor="filter-method">
          Payment method
        </label>
        <NativeSelect
          id="filter-method"
          value={params.method ?? ""}
          onChange={(e) => push({ method: e.target.value || undefined })}
          className="sm:w-44"
        >
          <option value="">All methods</option>
          {Object.entries(PAYMENT_METHOD_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </NativeSelect>
        <label className="sr-only" htmlFor="filter-pay">
          Payment status
        </label>
        <NativeSelect
          id="filter-pay"
          value={params[statusKey] ?? ""}
          onChange={(e) => push({ [statusKey]: e.target.value || undefined })}
          className="sm:w-40"
        >
          <option value="">Any payment status</option>
          {Object.entries(PAYMENT_STATUS_META).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </NativeSelect>
        {showRange ? (
          <>
            <label className="sr-only" htmlFor="filter-range">
              Date range
            </label>
            <NativeSelect
              id="filter-range"
              value={params.range ?? ""}
              onChange={(e) => push({ range: e.target.value || undefined })}
              className="col-span-2 sm:col-span-1 sm:w-36"
            >
              <option value="">All time</option>
              {Object.entries(RANGE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </>
        ) : null}
        {hasFilters ? (
          <Button
            variant="ghost"
            size="sm"
            className="col-span-2 sm:col-span-1"
            onClick={() => {
              setQ("");
              push({ q: undefined, method: undefined, [statusKey]: undefined, range: undefined });
            }}
          >
            <X aria-hidden /> Clear
          </Button>
        ) : null}
        {pending ? <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Loading" /> : null}
      </div>
    </div>
  );
}
