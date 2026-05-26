import type { ReactNode, CSSProperties } from "react";

// Layout shell. The kit is unopinionated about WHICH navigation
// primitives sit in each slot — pass <LeftNavRail>, <Topbar>,
// <MobileTabBar> etc. (or your own equivalents) and Shell composes
// them into the standard layout:
//
//   ┌──────────────────────────────────────────┐
//   │ topbar (full width, fixed)               │
//   ├────────┬─────────────────────────┬───────┤
//   │        │                         │       │
//   │  left  │ main (children)         │ right │
//   │   nav  │                         │  rail │
//   │  (fix) │ insets via CSS vars     │ (fix) │
//   │        │                         │       │
//   └────────┴─────────────────────────┴───────┘
//
// All three rails are position:fixed and stamp their widths/heights
// as CSS vars (--ck-leftnav-width, --ck-rightrail-width,
// --ck-tabbar-height). Shell reads those vars to inset the main
// region. No prop drilling.

export interface ShellProps {
  // Drop <LeftNavRail> here. Shell renders it as-is; the rail itself
  // handles fixed positioning.
  leftRail?: ReactNode;
  // <Topbar>. Sticky at the top of the main column.
  topbar?: ReactNode;
  // Page body.
  children: ReactNode;
  // Right rail (e.g. agent panel, comments panel) — rendered as-is.
  rightRail?: ReactNode;
  // Mobile bottom tab bar — rendered as-is.
  tabBar?: ReactNode;
  // Inline style overrides for the main region (useful for setting
  // background per route).
  mainStyle?: CSSProperties;
  className?: string;
}

export function Shell({
  leftRail,
  topbar,
  children,
  rightRail,
  tabBar,
  mainStyle,
  className,
}: ShellProps) {
  return (
    <div
      data-ck-shell
      className={className}
      style={{
        minHeight: "100vh",
        background: "var(--ck-bg-canvas)",
        color: "var(--ck-text-primary)",
      }}
    >
      {leftRail}
      {rightRail}
      {tabBar}
      <div
        style={
          {
            marginLeft: "var(--ck-leftnav-width, 0px)",
            marginRight: "var(--ck-rightrail-width, 0px)",
            paddingBottom: "var(--ck-tabbar-height, 0px)",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            transition: "margin var(--ck-dur-fast) var(--ck-ease)",
          } as CSSProperties
        }
      >
        {topbar && (
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 20,
            }}
          >
            {topbar}
          </div>
        )}
        <main style={{ flex: 1, minHeight: 0, ...mainStyle }}>{children}</main>
      </div>
    </div>
  );
}
