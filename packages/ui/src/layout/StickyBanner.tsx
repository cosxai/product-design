import type { ReactNode, CSSProperties } from "react";

// Eyebrow + title + optional right-slot, sticky at top of a page
// region (NOT the topbar — this is for an in-page sticky like
// "Reviewing as <name>" or "Document signed · view audit log").
// Caller controls when it shows. Visual mass matches a topbar
// (64 px) so it can sit directly underneath one cleanly.

export interface StickyBannerProps {
  eyebrow?: string;
  title: ReactNode;
  // Right-aligned action cluster.
  actions?: ReactNode;
  // Sticky top offset in px. Default 64 (below topbar).
  topOffset?: number;
  height?: number;
  className?: string;
  // Visual tone — adjusts background. Default 'info'.
  tone?: "info" | "warning" | "success" | "critical";
}

const TONE_BG: Record<NonNullable<StickyBannerProps["tone"]>, string> = {
  info: "var(--ck-info-muted)",
  warning: "var(--ck-warning-muted)",
  success: "var(--ck-success-muted)",
  critical: "var(--ck-critical-muted)",
};
const TONE_BORDER: Record<NonNullable<StickyBannerProps["tone"]>, string> = {
  info: "var(--ck-accent-border)",
  warning: "var(--ck-warning)",
  success: "var(--ck-success)",
  critical: "var(--ck-critical)",
};

export function StickyBanner({
  eyebrow,
  title,
  actions,
  topOffset = 64,
  height = 64,
  className,
  tone = "info",
}: StickyBannerProps) {
  return (
    <div
      className={className}
      style={
        {
          position: "sticky",
          top: topOffset,
          height,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: TONE_BG[tone],
          borderBottom: `1px solid ${TONE_BORDER[tone]}`,
          zIndex: 10,
          fontFamily: "var(--ck-font-sans)",
        } as CSSProperties
      }
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && (
          <div className="ck-eyebrow" style={{ marginBottom: 2 }}>
            {eyebrow}
          </div>
        )}
        <div
          style={{
            font: "500 14px/1.3 var(--ck-font-sans)",
            color: "var(--ck-text-primary)",
          }}
        >
          {title}
        </div>
      </div>
      {actions && (
        <div style={{ display: "flex", gap: 8, flex: "none" }}>{actions}</div>
      )}
    </div>
  );
}
