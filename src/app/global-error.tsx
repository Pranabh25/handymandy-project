"use client";

/** Last-resort boundary for errors in the root layout. Renders its own document without app styles. */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#faf6f0",
          color: "#2a2623",
          fontFamily: "Georgia, 'Times New Roman', serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <title>Something went wrong | LushAura</title>
        <div style={{ maxWidth: 440 }}>
          <p style={{ fontSize: 28, margin: 0 }}>
            Lush<em style={{ color: "#a85d45" }}>Aura</em>
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: "24px 0 12px" }}>Something went wrong</h1>
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 15, lineHeight: 1.6, color: "#6f665e", margin: 0 }}>
            We couldn&apos;t load the store just now. Please try again in a moment.
            {error.digest ? ` (Ref: ${error.digest})` : null}
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                height: 44,
                padding: "0 24px",
                borderRadius: 10,
                border: 0,
                background: "#2a2623",
                color: "#faf6f0",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* Plain anchor: global-error replaces the root layout, so a full reload is intended. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                height: 44,
                lineHeight: "44px",
                padding: "0 24px",
                borderRadius: 10,
                border: "1px solid #e6ddd1",
                color: "#2a2623",
                textDecoration: "none",
              }}
            >
              Go to homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
