import { useContext, useEffect } from "react";
import { ActionBarContext } from "./actionbar-context";
import type { ActionBarPanel } from "./types";

// Push a panel config into the action bar's popover slot (design#13).
//
// The BAR owns positioning: docked above itself, centered, following
// drag natively (it renders the panel inside its own fixed-position
// root — no polling, no rect maths in the consumer) and viewport-
// clamped at the edges. The chrome themes own the panel's visual
// identity via `.ck-actionbar-panel`; consumers must NOT paint their
// own background/border/shadow. The consumer owns only the content
// subtree and the `open` state.
//
// The bar calls `onOpenChange(false)` on outside-click and Escape.
// Pass `null` to clear (also cleared automatically on unmount).
// Last call wins — one panel at a time, same contract as the status
// dot.
export function useActionBarPanel(config: ActionBarPanel | null) {
  const ctx = useContext(ActionBarContext);
  if (!ctx) {
    throw new Error("useActionBarPanel must be used within <ActionBarProvider>");
  }
  const { setPanel } = ctx;
  const open = config?.open;
  const onOpenChange = config?.onOpenChange;
  const content = config?.content;
  const width = config?.width;
  const ariaLabel = config?.ariaLabel;
  useEffect(() => {
    if (open === undefined || onOpenChange === undefined) {
      setPanel(null);
      return;
    }
    setPanel({
      open,
      onOpenChange,
      content,
      ...(width !== undefined ? { width } : {}),
      ...(ariaLabel !== undefined ? { ariaLabel } : {}),
    });
    return () => {
      setPanel(null);
    };
  }, [setPanel, open, onOpenChange, content, width, ariaLabel]);
}
