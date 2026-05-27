import { Button, Tooltip, PageHeader, Tag, relativeTime, formatDate, formatTimestamp } from "@cosxai/ui";

export function BonusPage() {
  const now = Date.now();
  const sampleTimes = [
    now - 30 * 1000,
    now - 5 * 60 * 1000,
    now - 2 * 60 * 60 * 1000,
    now - 3 * 24 * 60 * 60 * 1000,
    now - 40 * 24 * 60 * 60 * 1000,
  ];
  return (
    <>
      <h1>Bonus primitives</h1>
      <p className="docs-summary">
        Smaller, single-purpose pieces that pay off in every app —
        tooltips that replace native <code>title=</code>, a header
        for list pages, time formatters for activity rows.
      </p>

      <h2>Tooltip</h2>
      <p>
        Quick-reveal (120 ms default vs the OS' ~500 ms), portal-
        rendered so it floats above transformed parents and fixed
        bars. Wraps one child via cloneElement — your trigger keeps
        its existing handlers.
      </p>
      <div
        style={{
          padding: 16,
          background: "var(--ck-bg-surface)",
          border: "1px solid var(--ck-border-subtle)",
          borderRadius: "var(--ck-radius-md)",
          marginBottom: 16,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <Tooltip content="Tooltip on top (default placement)">
          <Button variant="ghost">Hover me</Button>
        </Tooltip>
        <Tooltip content="And this one below" placement="bottom">
          <Button variant="ghost">Bottom placement</Button>
        </Tooltip>
        <Tooltip content="No delay" delay={0}>
          <Button variant="ghost">Instant</Button>
        </Tooltip>
      </div>
      <pre><code>{`<Tooltip content="Helen Wang · helen@cosx.co">
  <button>HW</button>
</Tooltip>`}</code></pre>

      <h2>PageHeader</h2>
      <p>
        Standard list-page header — eyebrow + title + description +
        right-aligned actions. Use as the topmost child of any
        landing or list page.
      </p>
      <div
        style={{
          padding: 16,
          background: "var(--ck-bg-surface)",
          border: "1px solid var(--ck-border-subtle)",
          borderRadius: "var(--ck-radius-md)",
          marginBottom: 16,
        }}
      >
        <PageHeader
          eyebrow="Access · Shares"
          title="Bundles you've sent."
          description="Each share bundles documents into a single invitation link with optional expiry, forwarding, and watermark rules."
          actions={
            <>
              <Button variant="ghost">Filter</Button>
              <Button variant="primary">New share</Button>
            </>
          }
        />
        <p style={{ font: "400 13px/1.5 var(--ck-font-sans)", color: "var(--ck-text-tertiary)", margin: 0 }}>
          (rest of the page goes here)
        </p>
      </div>

      <h2>Time helpers</h2>
      <p>
        <code>relativeTime()</code> for "5m ago" cues,{" "}
        <code>formatDate()</code> + <code>formatTimestamp()</code>{" "}
        for locale-aware full timestamps with built-in null safety
        (renders <code>—</code> for missing values).
      </p>
      <div
        style={{
          padding: 16,
          background: "var(--ck-bg-surface)",
          border: "1px solid var(--ck-border-subtle)",
          borderRadius: "var(--ck-radius-md)",
          marginBottom: 16,
          font: "400 13px/1.7 var(--ck-font-mono)",
        }}
      >
        {sampleTimes.map((t) => (
          <div key={t} style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 4 }}>
            <Tag tone="neutral">
              relativeTime
            </Tag>
            <span style={{ color: "var(--ck-text-primary)", minWidth: 100 }}>
              {relativeTime(t)}
            </span>
            <span style={{ color: "var(--ck-text-tertiary)" }}>
              {formatTimestamp(t, { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" })}
            </span>
          </div>
        ))}
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 8, color: "var(--ck-text-tertiary)" }}>
          <Tag tone="neutral">null-safe</Tag>
          <span>formatDate(null) → "{formatDate(null)}"</span>
          <span>formatDate(undefined) → "{formatDate(undefined)}"</span>
        </div>
      </div>
      <pre><code>{`import { relativeTime, formatDate, formatTimestamp } from "@cosxai/ui";

relativeTime(Date.now() - 60_000)      // "1m ago"
formatDate(1700000000000)              // locale date
formatTimestamp(ts, { dateStyle: "medium", timeStyle: "short" })
formatDate(null)                       // "—"`}</code></pre>
    </>
  );
}
