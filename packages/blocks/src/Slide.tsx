import { useEffect, useRef, useState, type ReactNode } from "react";

import { useBrand } from "./BrandProvider";

// Slide — 16:9 artboard chrome for block_doc pages rendered in slide
// layout. Fixed 1024×576 design coordinates.
//
// Sizing modes:
//   - Default (renderMode = false): ResizeObserver on the outer frame
//     derives a scale factor so the artboard fits the current viewport
//     width. Container is `w-full aspectRatio: 16/9`.
//   - renderMode = true: skip the observer, scale = 1, container is
//     fixed at the design coordinates. Used by server-side thumbnail
//     renderers (htmlproc sidecar) so puppeteer clips deterministically.
//
// Header logo + slide count + optional badge come from BrandProvider so
// white-labeling swaps them without touching this file.

const DESIGN_W = 1024;
const DESIGN_H = 576;

export interface SlideProps {
  children: ReactNode;
  /** Zero-based page index for the "1 / 10" indicator. */
  index: number;
  /** Total pages in the doc for the "1 / 10" denominator. */
  totalSlides: number;
  /** Optional per-slide title / badge — replaces the brand logo. */
  badge?: string | undefined;
  /** Optional label; renders under the artboard in dev builds. */
  title?: string | undefined;
  /**
   * Server-side render mode. When true, skips ResizeObserver and
   * renders at native design DIP (1024×576). Consumers building
   * thumbnails via headless Chrome pass this + a matching viewport
   * so the screenshot clip is deterministic.
   */
  renderMode?: boolean | undefined;
}

export function Slide({
  children,
  index,
  totalSlides,
  badge,
  title,
  renderMode,
}: SlideProps) {
  const brand = useBrand();
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

  const num = String(index + 1).padStart(2, "0");
  const total = String(totalSlides).padStart(2, "0");
  const actualW = Math.round(DESIGN_W * scale);
  const actualH = Math.round(DESIGN_H * scale);

  const frameStyle = renderMode
    ? { width: DESIGN_W, height: DESIGN_H }
    : { aspectRatio: "16 / 9" as const };

  return (
    <div className="w-full flex flex-col items-center">
      {title && !renderMode && (
        <div className="w-full max-w-[1440px] mb-1 flex justify-between text-[10px] text-zinc-500 uppercase tracking-wider">
          <span>Slide {index + 1} · {title}</span>
          <span>{actualW}×{actualH}</span>
        </div>
      )}
      <div
        ref={frameRef}
        data-page-index={index}
        className={
          renderMode
            ? "relative bg-white overflow-hidden"
            : "relative w-full rounded border border-zinc-300 bg-white overflow-hidden"
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
          {/* Header row: logo or badge (left) + slide index (right) */}
          <div className="relative z-[1] flex justify-between items-center px-[40px] pt-[32px]">
            {badge ? (
              <span className="inline-block px-[12px] py-[4px] text-[10px] font-medium tracking-wider uppercase border border-zinc-300 rounded-full text-zinc-600">
                {badge}
              </span>
            ) : (
              <img src={brand.logoUrl} alt={brand.logoAlt} className="h-[44px] w-auto" />
            )}
            <div className="flex items-center gap-4 text-zinc-500">
              {!badge && (
                <span className="text-[10px] uppercase tracking-widest">
                  {brand.confidentialFooter}
                </span>
              )}
              <span className="text-[12px]">
                {num} / {total}
              </span>
            </div>
          </div>
          {/* Body */}
          <div
            className={
              badge
                ? "relative z-[1] px-[40px] pb-[32px] flex-1 flex flex-col pt-[12px] justify-start"
                : "relative z-[1] px-[40px] pb-[32px] flex-1 flex flex-col pt-[8px] justify-center"
            }
          >
            {children}
          </div>
          {/* Footer confidential note — only when a badge is set (badge
              swaps out the header logo so the footer picks up the
              confidential line the header would otherwise carry) */}
          {badge && (
            <div className="absolute bottom-[16px] right-[40px] z-[1] text-right">
              <p className="text-[8px] text-zinc-500 uppercase tracking-widest leading-relaxed whitespace-pre-line">
                {brand.confidentialFooter}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
