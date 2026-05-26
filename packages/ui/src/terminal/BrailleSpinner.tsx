import { useEffect, useState } from "react";

// Braille-pattern spinner — the canonical TUI activity indicator.
// 10-frame cycle at 80 ms per frame ≈ 12.5 fps, which reads as
// the same gentle rotation you see in `npm install` or
// `gum spin`. Render inline anywhere you'd otherwise reach for a
// CSS circular spinner — they don't belong under this chrome.

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export interface BrailleSpinnerProps {
  // Frame interval in ms. Default 80.
  intervalMs?: number;
  // Stop / start cycling. Default true.
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function BrailleSpinner({
  intervalMs = 80,
  active = true,
  className,
  style,
}: BrailleSpinnerProps) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setI((x) => (x + 1) % FRAMES.length), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs, active]);
  return (
    <span
      aria-label="loading"
      className={className}
      style={{
        fontFamily: "var(--ck-font-mono)",
        display: "inline-block",
        width: "1ch",
        ...style,
      }}
    >
      {FRAMES[i]}
    </span>
  );
}
