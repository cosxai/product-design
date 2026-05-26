import { cn } from "../lib/cn";

// Small filled pill showing an integer count. Caps at 99+ to keep
// the visual mass tight. Returns null at 0 — call sites can
// unconditionally render it inside a label without an `if (n > 0)`.

export interface CountBadgeProps {
  count: number;
  size?: "sm" | "md";
  // Tone — default accent. Use "critical" for notifications.
  tone?: "accent" | "critical" | "neutral";
  className?: string;
}

const TONE_BG: Record<NonNullable<CountBadgeProps["tone"]>, string> = {
  accent: "var(--ck-accent)",
  critical: "var(--ck-critical)",
  neutral: "var(--ck-text-tertiary)",
};

export function CountBadge({
  count,
  size = "md",
  tone = "accent",
  className,
}: CountBadgeProps) {
  if (count <= 0) return null;
  const display = count > 99 ? "99+" : String(count);
  const isSm = size === "sm";
  return (
    <span
      className={cn("ck-count-badge", className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: isSm ? 14 : 18,
        height: isSm ? 14 : 18,
        padding: "0 5px",
        background: TONE_BG[tone],
        color: "var(--ck-text-inverse)",
        font: `500 ${isSm ? 10 : 11}px/1 var(--ck-font-mono)`,
        borderRadius: 999,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {display}
    </span>
  );
}
