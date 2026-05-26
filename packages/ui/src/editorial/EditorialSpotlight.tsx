import type { ReactNode, CSSProperties } from "react";

// Local "spotlight" inversion for editorial chrome — the
// dark-canvas-with-cream-cards pattern from the brief, scoped to
// a single section rather than the whole page.
//
// Sets local CSS vars on a wrapper so every descendant component
// re-reads its tokens from the inverted palette. Pure CSS variable
// re-binding; no JS or context needed. Used inside any chrome —
// the kit doesn't require editorial to be active for the wrapper
// to work — but the visual lineage (cream surface + coral accent)
// reads most strongly under editorial.

export interface EditorialSpotlightProps {
  children: ReactNode;
  // Optional inner padding. Default 32 px.
  padding?: number | string;
  className?: string;
  style?: CSSProperties;
}

export function EditorialSpotlight({
  children,
  padding = 32,
  className,
  style,
}: EditorialSpotlightProps) {
  return (
    <div
      className={className}
      data-ck-spotlight
      style={
        {
          // Dark canvas surrounding cream-paper cards.
          background: "#0E0E0E",
          color: "#F4EFE0",
          padding,
          borderRadius: "var(--ck-radius-md)",
          // Rebind tokens so descendant components (Button, Card,
          // Tag, etc.) read inverted values. Card surface stays
          // cream; everything else flips to dark.
          ["--ck-bg-canvas"]: "#0E0E0E",
          ["--ck-bg-surface"]: "#F4EFE0",
          ["--ck-bg-surface-2"]: "#E5DECB",
          ["--ck-bg-muted"]: "#1F1F1F",
          ["--ck-text-primary"]: "#F4EFE0",
          ["--ck-text-secondary"]: "#C9C3B5",
          ["--ck-text-tertiary"]: "#8F897D",
          ["--ck-text-inverse"]: "#0F0F0F",
          ["--ck-border-subtle"]: "rgba(244, 239, 224, 0.18)",
          ["--ck-border-strong"]: "rgba(244, 239, 224, 0.32)",
          ...style,
        } as CSSProperties
      }
    >
      {/* Inner wrapper re-binds the text colour back to dark
          ink so anything sitting on the cream cards inside reads
          correctly. <Card> children get this for free via the
          token rebinding on .ck-card. */}
      {children}
    </div>
  );
}
