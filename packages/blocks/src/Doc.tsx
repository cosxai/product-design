import { useEffect, useRef, useState, type ReactNode } from "react";

import { useBrand } from "./BrandProvider.js";

// Doc — A4 page chrome for block_doc pages rendered in document
// layout. Fixed 794×1123 design coordinates (A4 at 96 DPI).
//
// Sizing modes:
//   - Default (renderMode = false): viewer context. ResizeObserver on
//     the outer frame derives a scale factor so the page fits the
//     current viewport width; the running header shows the brand logo
//     + doc title + page counter, and the footer shows the brand
//     confidential line.
//   - renderMode = true: server-side thumbnail context (htmlproc
//     sidecar). Skips the observer, scale = 1, container fixed at the
//     design coordinates for deterministic puppeteer clipping. The
//     brand-derived header logo + confidential footer are suppressed
//     — thumbnails picture the AUTHORED content, not workspace-branded
//     chrome (per the M4.5 followup review: branding belongs to
//     templates authored in blocks, not to a viewer-time Doc wrapper).
//     Page counter + doc title stay visible so a card still reads as
//     "this document, page N of M".

const DESIGN_W = 794;
const DESIGN_H = 1123;

export interface DocProps {
  children: ReactNode;
  /** Zero-based page index. */
  index: number;
  /** Total pages in the doc. */
  totalPages: number;
  /** Header title on every page. */
  title: string;
  /** Optional per-page label. */
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
  title,
  label,
  renderMode,
}: DocProps) {
  const brand = useBrand();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState<number>(1);

  // See Slide.tsx for the useEffect + renderMode reset rationale
  // (SSR safety in the htmlproc sidecar + clean scale reset on toggle).
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

  const num = String(index + 1).padStart(2, "0");
  const total = String(totalPages).padStart(2, "0");

  const frameStyle = renderMode
    ? { width: DESIGN_W, height: DESIGN_H }
    : { aspectRatio: `${DESIGN_W} / ${DESIGN_H}` };

  return (
    <div className="w-full flex justify-center">
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
          {/* Header. renderMode strips the logo (brand doesn't belong
              in a picture-of-content thumbnail); the title still shows
              so the card reads as the right doc. */}
          <div className="relative flex justify-between items-baseline px-[40px] pt-[24px]">
            <div className="flex items-baseline gap-3">
              {!renderMode && (
                <img src={brand.logoUrl} alt={brand.logoAlt} className="h-[20px] w-auto" />
              )}
              <p className="text-[10px] font-medium tracking-wide text-zinc-800">{title}</p>
            </div>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest">
              Page {num} / {total}
            </span>
          </div>
          {label && (
            <p className="px-[40px] mt-1 text-[9px] uppercase tracking-widest text-zinc-500">
              {label}
            </p>
          )}
          {/* Body */}
          <div className="px-[40px] py-[16px] flex-1 flex flex-col">{children}</div>
          {/* Footer. renderMode drops the confidential line + the
              divider — thumbnails shouldn't carry workspace-brand
              text. The body flex-1 keeps content pinned to the top. */}
          {!renderMode && (
            <div className="px-[40px] pb-[16px] border-t border-zinc-100 pt-[8px]">
              <p className="text-[8px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                {brand.confidentialFooter}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
