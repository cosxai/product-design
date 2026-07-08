import { forwardRef, type CSSProperties } from "react";

// ActionBarModeHandle — the top-edge peek button that lets a user
// switch the ActionBar between two content sets ("modes"). Sits
// above the ActionBar's centred bottom position, showing only a
// slim 6px sliver at rest; grows on hover / focus to a full 28px
// tappable disc with a tooltip beneath the pointer.
//
// Compose with: `useActionBarMode` hook (or your own state) to swap
// the items registered via useActionBarItems when the handle fires
// onClick. Gate visibility on a permission bit (e.g.
// `document.capabilities.manage`) — passing `visible={false}` hides
// the handle entirely so non-privileged users never see the
// affordance.
//
// Visual: fixed positioning centred at the bottom of the viewport,
// stacked ABOVE the ActionBar (which lives at `bottom: 24px +
// tabbar-height`). The handle sits ~6px above the ActionBar's top
// edge at rest and animates upward on hover.
//
// Positioning contract: consumers may pass `bottom` to override the
// default 66px (24 gutter + 48 bar height - 6 overlap). Otherwise
// this matches the default ActionBar's centred bottom placement.
//
// Forwards ref to the underlying <button>.
export interface ActionBarModeHandleProps {
  /**
   * Called when the handle is clicked / activated. Consumer should
   * flip the active mode state here (which drives
   * useActionBarItems(sourceKey, items) with a different sourceKey).
   */
  onClick: () => void;
  /**
   * Human-readable label describing what the click will do
   * ("Switch to manage mode"). Used as both aria-label and the
   * hover tooltip.
   */
  label: string;
  /**
   * When false, the handle renders nothing. Consumers wire this to
   * their capability check (e.g. `capabilities.manage === true`)
   * so principals without the permission never see the affordance.
   * Default: true.
   */
  visible?: boolean | undefined;
  /**
   * Optional bottom offset in px (default: matches the ActionBar's
   * default centred position — 66px = 24 gutter + 48 bar height - 6
   * overlap, plus the same tabbar + safe-area terms). Override when
   * the ActionBar is docked non-default.
   */
  bottom?: number | string | undefined;
  /**
   * Extra className appended to the handle's root class. Handy for
   * tests + one-off styling. Default className: `ck-actionbar-handle`.
   */
  className?: string | undefined;
  /**
   * Extra inline styles merged onto the root. Only use for one-off
   * z-index / offset overrides; the visual language should stay
   * consistent across surfaces.
   */
  style?: CSSProperties | undefined;
}

const HANDLE_REST_WIDTH = 44;
const HANDLE_REST_HEIGHT = 6;
const HANDLE_HOVER_WIDTH = 68;
const HANDLE_HOVER_HEIGHT = 24;
// Overlap the ActionBar's top edge by 4px so the handle looks
// tethered to the bar rather than floating above it.
const HANDLE_BOTTOM_DEFAULT = "calc(24px + 48px - 4px + var(--ck-tabbar-height, 0px) + env(safe-area-inset-bottom, 0px))";

export const ActionBarModeHandle = forwardRef<HTMLButtonElement, ActionBarModeHandleProps>(
  function ActionBarModeHandle(
    {
      onClick,
      label,
      visible = true,
      bottom,
      className,
      style,
    },
    ref,
  ) {
    if (!visible) return null;
    const resolvedBottom =
      typeof bottom === "number"
        ? `${bottom}px`
        : typeof bottom === "string"
          ? bottom
          : HANDLE_BOTTOM_DEFAULT;
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className={`ck-actionbar-handle${className ? ` ${className}` : ""}`}
        style={{
          position: "fixed",
          left: "50%",
          bottom: resolvedBottom,
          transform: "translateX(-50%)",
          // Rest state: narrow slim strip at the top edge of the bar.
          width: `var(--ck-actionbar-handle-w, ${HANDLE_REST_WIDTH}px)`,
          height: `var(--ck-actionbar-handle-h, ${HANDLE_REST_HEIGHT}px)`,
          padding: 0,
          margin: 0,
          border: 0,
          borderRadius: 999,
          background: "var(--ck-accent, #4f46e5)",
          color: "var(--ck-accent-fg, #fff)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: 0.2,
          lineHeight: 1,
          overflow: "hidden",
          whiteSpace: "nowrap",
          cursor: "pointer",
          // Sit above the ActionBar (z-index 80 in ActionBar.tsx).
          zIndex: 85,
          boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
          transition:
            "width 220ms cubic-bezier(0.34, 1.56, 0.64, 1)," +
            "height 220ms cubic-bezier(0.34, 1.56, 0.64, 1)," +
            "box-shadow 220ms ease-out",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
        // Inline hover/focus expansion — pure CSS on the same element
        // via CSSProperties gives us the animation without a global
        // stylesheet dependency in the kit.
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.setProperty("--ck-actionbar-handle-w", `${HANDLE_HOVER_WIDTH}px`);
          el.style.setProperty("--ck-actionbar-handle-h", `${HANDLE_HOVER_HEIGHT}px`);
          el.style.boxShadow = "0 4px 14px rgba(0,0,0,0.22)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.setProperty("--ck-actionbar-handle-w", `${HANDLE_REST_WIDTH}px`);
          el.style.setProperty("--ck-actionbar-handle-h", `${HANDLE_REST_HEIGHT}px`);
          el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.14)";
        }}
        onFocus={(e) => {
          const el = e.currentTarget;
          el.style.setProperty("--ck-actionbar-handle-w", `${HANDLE_HOVER_WIDTH}px`);
          el.style.setProperty("--ck-actionbar-handle-h", `${HANDLE_HOVER_HEIGHT}px`);
          el.style.boxShadow = "0 4px 14px rgba(0,0,0,0.22)";
        }}
        onBlur={(e) => {
          const el = e.currentTarget;
          el.style.setProperty("--ck-actionbar-handle-w", `${HANDLE_REST_WIDTH}px`);
          el.style.setProperty("--ck-actionbar-handle-h", `${HANDLE_REST_HEIGHT}px`);
          el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.14)";
        }}
      >
        {/* Only visible when expanded — CSS `overflow: hidden` on the
            button clips it at rest. Kept as visible text (not aria-
            hidden) so screen readers can still hear it via title. */}
        <span aria-hidden style={{ opacity: 0.95 }}>
          {label}
        </span>
      </button>
    );
  },
);
