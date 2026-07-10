import { useEffect, useRef, useState, type ReactNode } from "react";

// Doc — A4 page chrome for block_doc pages. Fixed 794×1123 design
// coordinates (A4 at 96 DPI).
//
// Sizing modes: mirror Slide. Viewer mode (renderMode=false) fits the
// frame to the current viewport width via ResizeObserver + scale and
// shows a mono label strip above the frame with "Page N / Total"
// (left) + rendered dimensions (right), matching the PDF viewer.
// renderMode=true drops the strip and locks the frame to design DIP
// so puppeteer clips deterministically for thumbnails.
//
// Body content fills the entire frame — no in-frame logo, no title-
// in-frame header, no confidential footer. Workspace branding moves
// to per-workspace TEMPLATES (M6+) that author their own header /
// footer blocks; until then viewer chrome is deliberately neutral so
// a picture-of-content thumbnail and a viewer-mounted page look
// pixel-consistent.

const DESIGN_W = 794;
const DESIGN_H = 1123;

export interface DocProps {
  children: ReactNode;
  /** Zero-based page index for the "Page N / M" indicator. */
  index: number;
  /** Total pages in the doc. */
  totalPages: number;
  /** Reserved for future template-driven headers. Currently ignored. */
  title: string;
  /** Reserved for future template-driven per-page labels. Currently ignored. */
  label?: string | undefined;
  /**
   * Server-side render mode. See SlideProps.renderMode for semantics.
   */
  renderMode?: boolean | undefined;
}

export function Doc({
  children,
  index,
  totalPages,
  renderMode,
}: DocProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number>(1);

  // See Slide.tsx for the useEffect + renderMode reset rationale.
  useEffect(() => {
    if (renderMode) {
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
    : { aspectRatio: `${DESIGN_W} / ${DESIGN_H}` };

  return (
    <div className="w-full flex flex-col items-center">
      {!renderMode && (
        <div className="w-full max-w-[794px] mb-2 flex justify-between items-baseline font-mono text-[11px] uppercase tracking-widest text-zinc-500">
          <span>
            Page {index + 1} / {totalPages}
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
            : "relative w-full max-w-[794px] rounded border border-zinc-300 bg-white overflow-hidden"
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
              header comment). A4 pages flow top-to-bottom, so content
              anchors at the top (no vertical center like Slide). */}
          <div className="px-[40px] py-[32px] flex-1 flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
