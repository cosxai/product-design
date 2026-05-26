import type { ReactNode } from "react";
import { cn } from "../lib/cn";

// Small uppercase-mono pill — "PENDING", "LIVE", "Accepted", "3 docs".
// Same vocabulary as ck-tag in base.css but with explicit tone variants
// instead of inline color overrides. Use this when the tag is a status
// indicator; use the bare .ck-tag class when it's just a caption.

export type TagTone = "neutral" | "accent" | "success" | "warning" | "critical";

export interface TagProps {
  tone?: TagTone;
  // Renders as a filled pill (background tinted) instead of a bare
  // colored label. Default false.
  filled?: boolean;
  children: ReactNode;
  className?: string;
}

const TONE_COLOR: Record<TagTone, string> = {
  neutral: "var(--ck-text-tertiary)",
  accent: "var(--ck-accent)",
  success: "var(--ck-success)",
  warning: "var(--ck-warning)",
  critical: "var(--ck-critical)",
};
const TONE_BG: Record<TagTone, string> = {
  neutral: "var(--ck-bg-muted)",
  accent: "var(--ck-accent-muted)",
  success: "var(--ck-success-muted)",
  warning: "var(--ck-warning-muted)",
  critical: "var(--ck-critical-muted)",
};

export function Tag({ tone = "neutral", filled = false, children, className }: TagProps) {
  return (
    <span
      className={cn("ck-tag", className)}
      data-ck-tag
      data-tone={tone}
      data-filled={filled ? "true" : undefined}
      style={
        filled
          ? {
              color: TONE_COLOR[tone],
              background: TONE_BG[tone],
              padding: "3px 8px",
              borderRadius: "var(--ck-radius-sm)",
            }
          : { color: TONE_COLOR[tone] }
      }
    >
      {children}
    </span>
  );
}
