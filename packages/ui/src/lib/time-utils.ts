// Time formatting helpers.

// "3m ago" / "2h ago" / "5d ago", falls back to a locale date past
// 30 days. Use for activity rows, comment timestamps, anywhere a
// short relative cue beats a full timestamp.
export function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.round(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  return new Date(ts).toLocaleDateString();
}

// Null-safe locale date formatter — accepts ms timestamps, ISO
// strings, null, undefined, or non-finite values. Empty inputs
// render as an em-dash placeholder ("—"), which most list rows
// were doing inline with a ternary before.
export function formatDate(ms: number | string | null | undefined): string {
  const n = coerceMs(ms);
  if (n === null) return "—";
  return new Date(n).toLocaleDateString();
}

// Full date + time formatter with the same null-safe semantics.
export function formatTimestamp(
  ms: number | string | null | undefined,
  opts?: Intl.DateTimeFormatOptions,
): string {
  const n = coerceMs(ms);
  if (n === null) return "—";
  return opts ? new Date(n).toLocaleString(undefined, opts) : new Date(n).toLocaleString();
}

function coerceMs(ms: number | string | null | undefined): number | null {
  if (ms == null) return null;
  const n = typeof ms === "string" ? Number(ms) : ms;
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}
