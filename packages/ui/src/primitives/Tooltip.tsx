import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

// Lightweight tooltip — replaces the native `title=` attribute when
// you want a short reveal delay (default 120 ms vs the OS' ~500 ms)
// and styling that matches the kit's chrome. Portals to body so it
// floats above transformed parents / fixed bars.
//
// Wraps a single React element child; mouse + focus listeners are
// attached via clone so the trigger keeps its own handlers.

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement<{
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    onFocus?: React.FocusEventHandler;
    onBlur?: React.FocusEventHandler;
  }>;
  // ms before showing. Default 120.
  delay?: number;
  // "top" hovers above the trigger, "bottom" below. Default "top".
  placement?: "top" | "bottom";
  // Render even if `content` is falsy. Default false — callers can
  // wrap unconditionally without branching JSX.
  alwaysRender?: boolean;
}

export function Tooltip({
  content,
  children,
  delay = 120,
  placement = "top",
  alwaysRender = false,
}: TooltipProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const timerRef = useRef<number | null>(null);

  const cancelTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const computePos = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: r.left + r.width / 2,
      y: placement === "top" ? r.top : r.bottom,
    });
  }, [placement]);

  const show = useCallback(() => {
    cancelTimer();
    timerRef.current = window.setTimeout(() => {
      computePos();
      setOpen(true);
      timerRef.current = null;
    }, delay);
  }, [cancelTimer, computePos, delay]);

  const hide = useCallback(() => {
    cancelTimer();
    setOpen(false);
  }, [cancelTimer]);

  useEffect(() => {
    if (!open) return;
    const onScrollResize = () => computePos();
    window.addEventListener("scroll", onScrollResize, { passive: true, capture: true });
    window.addEventListener("resize", onScrollResize);
    return () => {
      window.removeEventListener("scroll", onScrollResize, { capture: true });
      window.removeEventListener("resize", onScrollResize);
    };
  }, [open, computePos]);

  useEffect(() => cancelTimer, [cancelTimer]);

  if (!isValidElement(children)) return children;
  if (!content && !alwaysRender) return children;

  const child = children;
  // cloneElement's `Partial<P>` signature isn't compatible with the
  // `T | undefined` event-handler types in HTMLAttributes once
  // `exactOptionalPropertyTypes: true` is on. The runtime behaviour is fine —
  // React happily accepts these props on any host element. We narrow via
  // unknown to silence the type system on a known React-types limitation.
  const clonedProps = {
    ref: (el: HTMLElement | null) => {
      triggerRef.current = el;
      const childRef = (child as unknown as { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof childRef === "function") childRef(el);
      else if (childRef && typeof childRef === "object") {
        (childRef as { current: HTMLElement | null }).current = el;
      }
    },
    onMouseEnter: (e: React.MouseEvent) => {
      child.props.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      child.props.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: React.FocusEvent) => {
      child.props.onFocus?.(e);
      show();
    },
    onBlur: (e: React.FocusEvent) => {
      child.props.onBlur?.(e);
      hide();
    },
  };
  const clonedTrigger = cloneElement(
    child,
    clonedProps as unknown as Parameters<typeof cloneElement>[1],
  );

  const tooltipStyle: CSSProperties = {
    position: "fixed",
    left: pos?.x ?? -9999,
    top: pos?.y ?? -9999,
    transform:
      placement === "top"
        ? "translate(-50%, calc(-100% - 8px))"
        : "translate(-50%, 8px)",
    background: "var(--ck-bg-surface)",
    color: "var(--ck-text-primary)",
    border: "1px solid var(--ck-border-strong)",
    borderRadius: "var(--ck-radius-sm)",
    boxShadow: "var(--ck-shadow-2)",
    padding: "6px 10px",
    fontSize: 11,
    fontFamily: "var(--ck-font-mono)",
    lineHeight: 1.45,
    letterSpacing: "0.02em",
    pointerEvents: "none",
    zIndex: 9999,
    maxWidth: 320,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    opacity: open && pos ? 1 : 0,
    transition: "opacity 120ms ease",
  };

  return (
    <>
      {clonedTrigger}
      {(open || alwaysRender) &&
        pos &&
        createPortal(<div style={tooltipStyle}>{content}</div>, document.body)}
    </>
  );
}
