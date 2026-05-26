import type { CSSProperties } from "react";

// Vertical tracked-uppercase tagline in a far-side gutter — pure
// decoration that sets the magazine tone. Pin to either "left" or
// "right" edge of the viewport. Repeats the tagline string so it
// fills the column regardless of height.
//
// Skip on phones (the gutter doesn't exist on a 360-px-wide page).

export interface RunningMarginaliaProps {
  // The tagline to repeat. Don't include separators — the
  // component injects "  ×  " between repetitions.
  text: string;
  // Which edge to pin to. Default left.
  side?: "left" | "right";
  // px offset from the edge. Default 24.
  inset?: number;
  // How many repetitions to print. Default 8 — plenty for any
  // viewport at the default font size.
  repeat?: number;
  // Hide below this viewport width (px). Default 1024.
  hideBelow?: number;
  className?: string;
}

export function RunningMarginalia({
  text,
  side = "left",
  inset = 24,
  repeat = 8,
  hideBelow = 1024,
  className,
}: RunningMarginaliaProps) {
  const display: CSSProperties =
    typeof window !== "undefined" && window.innerWidth < hideBelow
      ? { display: "none" }
      : {};
  const fragments = new Array(repeat).fill(text).join("  ×  ");
  return (
    <aside
      aria-hidden
      className={className}
      style={{
        position: "fixed",
        top: "50%",
        [side]: inset,
        transform:
          side === "left"
            ? "translateY(-50%) rotate(-90deg)"
            : "translateY(-50%) rotate(90deg)",
        transformOrigin: side === "left" ? "left center" : "right center",
        font: "500 10px/1 var(--ck-font-sans)",
        letterSpacing: "0.36em",
        textTransform: "uppercase",
        color: "var(--ck-text-tertiary)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 5,
        ...display,
      }}
    >
      {fragments}
    </aside>
  );
}
