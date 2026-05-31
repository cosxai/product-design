import { useContext, useEffect } from "react";
import { ActionBarContext } from "./actionbar-context";
import type { ActionBarStatusDot } from "./types";

// Push a status-dot config into the action bar's right-edge slot.
// The bar renders the dot as bar-intrinsic chrome (mirroring the
// left-edge drag grip), separate from the items registry.
//
// Pass `null` to clear. Last call wins — there's no source-key
// fan-out as with items, because the status dot is a single
// system-level affordance (sync / connection / identity) and
// stacking multiple makes no UX sense.
//
// On unmount, the dot is cleared automatically.
//
// **Important**: pass a stable config object (typically via
// `useMemo`), or omit fields you don't change between renders.
// The effect re-runs when individual fields change — colour
// transitions or pulse toggles re-render the dot but don't thrash
// the bar.
export function useActionBarStatusDot(config: ActionBarStatusDot | null) {
  const ctx = useContext(ActionBarContext);
  if (!ctx) {
    throw new Error("useActionBarStatusDot must be used within <ActionBarProvider>");
  }
  const { setStatusDot } = ctx;
  // Project config to primitive deps so a fresh-but-equivalent
  // config object doesn't trigger thrash. onClick identity changes
  // are tolerated through a manual ref capture in the bar render.
  const color = config?.color;
  const title = config?.title;
  const onClick = config?.onClick;
  const pulse = config?.pulse;
  useEffect(() => {
    if (color === undefined) {
      setStatusDot(null);
      return;
    }
    setStatusDot({
      color,
      ...(title !== undefined ? { title } : {}),
      ...(onClick !== undefined ? { onClick } : {}),
      ...(pulse !== undefined ? { pulse } : {}),
    });
    return () => {
      setStatusDot(null);
    };
  }, [setStatusDot, color, title, onClick, pulse]);
}
