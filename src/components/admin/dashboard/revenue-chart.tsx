"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formatINR } from "@/lib/format";

type Point = { date: string; revenue: number };

const HEIGHT = 220;
const PAD = { top: 16, right: 8, bottom: 26, left: 52 };
const dayFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
const longFmt = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const compact = new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 });

function niceScale(max: number, ticks = 4) {
  if (max <= 0) return { top: 1000, step: 250 };
  const raw = max / ticks;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  return { top: Math.ceil(max / step) * step, step };
}

/** Column path with a 4px rounded data-end and a square baseline. */
function columnPath(x: number, y: number, w: number, h: number) {
  if (h <= 0) return "";
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

/** Revenue per day, last 30 days. Single series → no legend; title names it. */
export function RevenueChart({ data }: { data: Point[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [active, setActive] = useState<number | null>(null);
  const tableId = useId();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.floor(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const max = Math.max(0, ...data.map((d) => d.revenue));
  const { top, step } = niceScale(max);
  const innerW = width - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const band = innerW / data.length;
  const barW = Math.max(2, Math.min(24, band - 2));
  const y = (v: number) => PAD.top + innerH - (v / top) * innerH;
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
  const labelEvery = width < 480 ? 7 : width < 760 ? 5 : 3;
  const total = data.reduce((s, d) => s + d.revenue, 0);
  const best = data.reduce((b, d) => (d.revenue > b.revenue ? d : b), data[0] ?? { date: "", revenue: 0 });
  const date = (s: string) => new Date(`${s}T00:00:00Z`);

  function indexFromPointer(clientX: number, rect: DOMRect) {
    const i = Math.floor((clientX - rect.left - PAD.left) / band);
    return i >= 0 && i < data.length ? i : null;
  }

  const a = active != null ? data[active] : null;
  const tipLeft = active != null ? PAD.left + band * active + band / 2 : 0;

  return (
    <div>
      <div ref={wrapRef} className="relative w-full">
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          tabIndex={0}
          aria-label={`Revenue per day for the last 30 days. Total ${formatINR(total)}. Best day ${best.date ? longFmt.format(date(best.date)) : "none"} at ${formatINR(best.revenue)}. Use left and right arrow keys to read each day.`}
          className="block rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          onPointerMove={(e) => setActive(indexFromPointer(e.clientX, e.currentTarget.getBoundingClientRect()))}
          onPointerLeave={() => setActive(null)}
          onBlur={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              const d = e.key === "ArrowRight" ? 1 : -1;
              setActive((cur) => Math.min(data.length - 1, Math.max(0, (cur ?? (d > 0 ? -1 : data.length)) + d)));
            }
          }}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth={1} />
              <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted-foreground text-[11px] tabular-nums">
                {t === 0 ? "₹0" : `₹${compact.format(t)}`}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const x = PAD.left + band * i + (band - barW) / 2;
            const h = (d.revenue / top) * innerH;
            return (
              <g key={d.date}>
                {active === i ? <rect x={PAD.left + band * i} y={PAD.top} width={band} height={innerH} fill="var(--muted)" /> : null}
                <path
                  d={columnPath(x, y(d.revenue), barW, h)}
                  fill="var(--terracotta)"
                  opacity={active == null || active === i ? 1 : 0.55}
                />
                {i % labelEvery === (data.length - 1) % labelEvery ? (
                  <text x={PAD.left + band * i + band / 2} y={HEIGHT - 8} textAnchor="middle" className="fill-muted-foreground text-[11px]">
                    {dayFmt.format(date(d.date))}
                  </text>
                ) : null}
              </g>
            );
          })}
          <line x1={PAD.left} x2={width - PAD.right} y1={y(0)} y2={y(0)} stroke="var(--input)" strokeWidth={1} />
        </svg>
        {a ? (
          <div
            role="status"
            className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 rounded-lg border bg-popover px-3 py-2 text-xs whitespace-nowrap shadow-lift"
            style={{ left: Math.min(Math.max(tipLeft, 70), width - 70) }}
          >
            <p className="text-sm font-semibold tabular-nums">{formatINR(a.revenue)}</p>
            <p className="text-muted-foreground">{longFmt.format(date(a.date))}</p>
          </div>
        ) : null}
      </div>
      <details className="mt-3 text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">View as table</summary>
        <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border">
          <table className="w-full text-left" aria-describedby={tableId}>
            <caption id={tableId} className="sr-only">Revenue per day, last 30 days</caption>
            <thead className="sticky top-0 bg-muted">
              <tr>
                <th className="px-3 py-1.5 font-medium">Date</th>
                <th className="px-3 py-1.5 text-right font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.date} className="border-t">
                  <td className="px-3 py-1.5">{longFmt.format(date(d.date))}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{formatINR(d.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
