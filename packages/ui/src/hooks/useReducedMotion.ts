import { useEffect, useState } from "react";

// Boolean subscription to the OS-level `prefers-reduced-motion`
// query. Use in component code that wants to short-circuit
// non-essential animations (the kit's CSS already respects the
// query via `@media (prefers-reduced-motion: reduce)` so most
// components don't need this — only call sites that wrap their
// own JS-driven motion (canvas animations, scroll-jacking, etc.)).

export function useReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefers(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return prefers;
}
