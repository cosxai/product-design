import { useEffect, useState } from "react";

// Viewport size + named breakpoints. Layout components subscribe to
// this to switch desktop ↔ mobile shells, force-collapse the nav
// rail below a width threshold, etc.
//
// Single window listener for all consumers (mounted once per call
// site — keep usage minimal). For pages with many consumers, lift
// to a context if perf is ever an issue; not needed yet.

export interface Viewport {
  width: number;
  height: number;
  // Below this, render the mobile shell (bottom tab bar + slide-out nav).
  isPhone: boolean;
  // Below this, force-collapse the left nav rail to icon-only.
  isNarrow: boolean;
  // Below this, hide the right rail entirely.
  hidesRightRail: boolean;
}

export interface ViewportBreakpoints {
  phone: number;
  narrow: number;
  rightRail: number;
}

const DEFAULTS: ViewportBreakpoints = {
  phone: 768,
  narrow: 1100,
  rightRail: 1280,
};

function snapshot(b: ViewportBreakpoints): Viewport {
  if (typeof window === "undefined") {
    return { width: 1440, height: 900, isPhone: false, isNarrow: false, hidesRightRail: false };
  }
  const w = window.innerWidth;
  const h = window.innerHeight;
  return {
    width: w,
    height: h,
    isPhone: w < b.phone,
    isNarrow: w < b.narrow,
    hidesRightRail: w < b.rightRail,
  };
}

export function useViewport(breakpoints: Partial<ViewportBreakpoints> = {}): Viewport {
  const b: ViewportBreakpoints = { ...DEFAULTS, ...breakpoints };
  const [vp, setVp] = useState<Viewport>(() => snapshot(b));
  useEffect(() => {
    const onResize = () => setVp(snapshot(b));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // Breakpoints are stable across renders for any sane caller; stringify
    // to avoid unstable-object-identity re-runs without losing reactivity.
  }, [b.phone, b.narrow, b.rightRail]);
  return vp;
}
