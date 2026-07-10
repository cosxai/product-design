import { useEffect, useRef, useState, type ReactNode } from "react";

// Slide — 16:9 artboard chrome for block_doc pages. Fixed 1024×576
// design coordinates.
//
// Sizing modes:
//   - Default (renderMode = false): viewer context. Frame is
//     `w-full aspectRatio: 16/9` capped at 1440px; ResizeObserver
//     derives a scale factor so the artboard fits the current
//     viewport width. A mono label strip above the frame shows
//     "Page N / Total" (left) + rendered dimensions (right),
//     matching the PDF viewer's label pattern.
//   - renderMode = true: server-side thumbnail context (htmlproc
//     sidecar). Skips the observer + label strip, scale = 1,
//     container fixed at design DIP so puppeteer clips
//     deterministically.
//
// Both modes render block content as the entire frame — no in-frame
// logo, badge, confidential line, or counter. Workspace branding
// moves to per-workspace TEMPLATES (M6+) that author their own
// cover / header blocks; until then viewer chrome is deliberately
// neutral so a picture-of-content thumbnail and a viewer-mounted
// page look pixel-consistent.

const DESIGN_W = 1024;
const DESIGN_H = 576;

export interface SlideProps {
  children: ReactNode;
  /** Zero-based page index for the "Page N / M" indicator. */
  index: number;
  /** Total pages in the doc for the counter denominator. */
  totalSlides: number;
  /** Reserved for future template-driven badges. Currently ignored. */
  badge?: string | undefined;
  /** Reserved for future template-driven per-slide labels. Currently ignored. */
  title?: string | undefined;
  /**
   * Server-side render mode. When true, skips ResizeObserver + label
   * strip and renders at native design DIP (1024×576). Consumers
   * building thumbnails via headless Chrome pass this + a matching
   * viewport so the screenshot clip is deterministic.
   */
  renderMode?: boolean | undefined;
}

export function Slide({
  children,
  index,
  totalSlides,
  renderMode,
}: SlideProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number>(1);

  // useEffect (not useLayoutEffect) — this package renders under
  // react-dom/server (mesh htmlproc sidecar) where useLayoutEffect
  // emits a warning. useEffect is a no-op on the server and runs
  // synchronously enough on the client for the artboard scale to
  // stabilise before the user notices.
  useEffect(() => {
    if (renderMode) {
      // Native DIP + no observer. Reset scale so a prior
      // viewport-derived value doesn't leak in when the prop flips.
      setScale(1);
      return;
    }
    const el = frameRef.current;
    if (!el) return;
    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) setScale(w / DESIGN_W);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [renderMode]);

  const actualW = Math.round(DESIGN_W * scale);
  const actualH = Math.round(DESIGN_H * scale);

  const frameStyle = renderMode
    ? { width: DESIGN_W, height: DESIGN_H }
    : { aspectRatio: "16 / 9" as const };

  return (
    <div className="w-full flex flex-col items-center">
      {!renderMode && (
        <div className="w-full max-w-[1440px] mb-2 flex justify-between items-baseline font-mono text-[11px] uppercase tracking-widest text-zinc-500">
          <span>
            Page {index + 1} / {totalSlides}
          </span>
          <span>
            {actualW} × {actualH}
          </span>
        </div>
      )}
      <div
        ref={frameRef}
        data-page-index={index}
        className={
          renderMode
            ? "relative bg-white overflow-hidden"
            : "relative w-full max-w-[1440px] rounded border border-zinc-300 bg-white overflow-hidden"
        }
        style={frameStyle}
      >
        <div
          className="relative flex flex-col"
          style={{
            width: DESIGN_W,
            height: DESIGN_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* Body owns the whole frame — no in-frame chrome (see the
              header comment for the rationale). Center the content
              vertically since a slide is a spatial artboard, not a
              flowing page. */}
          <div className="relative z-[1] px-[40px] py-[32px] flex-1 flex flex-col justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
