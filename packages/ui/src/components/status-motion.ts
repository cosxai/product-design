import { useEffect, useState, type RefObject } from 'react';

const REDUCE = '(prefers-reduced-motion: reduce)';

/** Whether the person asked for reduced motion (live). */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(REDUCE).matches === true);
  useEffect(() => {
    const mq = window.matchMedia?.(REDUCE);
    if (!mq) return;
    const on = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduce;
}

/** A looping Web Animation on ref — none under reduced motion (the
 *  element keeps its still style) and none where the API is missing. */
export function useLoop(ref: RefObject<HTMLElement | null>, keyframes: Keyframe[], options: KeyframeAnimationOptions, on = true): void {
  const reduce = useReducedMotion();
  const key = JSON.stringify([keyframes, options]);
  useEffect(() => {
    const el = ref.current;
    if (!on || reduce || !el || typeof el.animate !== 'function') return;
    const a = el.animate(keyframes, { iterations: Infinity, ...options });
    return () => a.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, reduce, key]);
}
