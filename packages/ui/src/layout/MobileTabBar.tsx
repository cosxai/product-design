import { useEffect, type ReactNode, type CSSProperties } from "react";

// Fixed-bottom tab bar for phones. Sits above the home-indicator
// safe area on iOS, exposes --ck-tabbar-height so the GlobalActionBar
// and any sticky bottom UI can lift to clear it.
//
// Tab list is fully configurable — caller supplies items with an
// active match function so the bar can highlight the right one for
// the current pathname. No router coupling.

export interface MobileTab {
  key: string;
  label: string;
  icon: ReactNode;
  // Called when the tab is tapped. Caller handles navigation.
  onSelect: () => void;
  // Whether this tab represents the current route. Caller derives
  // from their router (e.g. `pathname.startsWith("/shares")`).
  active: boolean;
}

export interface MobileTabBarProps {
  tabs: MobileTab[];
  // Height of the bar (content area; safe-area inset added on top).
  // Default 56 px.
  height?: number;
  className?: string;
}

export function MobileTabBar({
  tabs,
  height = 56,
  className,
}: MobileTabBarProps) {
  // Stamp --ck-tabbar-height. Includes safe-area inset so consumers
  // (e.g. floating action bar) can lift cleanly above the home
  // indicator. iOS env() works in calc() inside :root vars.
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--ck-tabbar-height",
      `calc(${height}px + env(safe-area-inset-bottom, 0px))`,
    );
    return () => {
      document.documentElement.style.setProperty("--ck-tabbar-height", "0px");
    };
  }, [height]);

  return (
    <nav
      data-ck-tabbar
      aria-label="Primary"
      className={className}
      style={
        {
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: "var(--ck-tabbar-height)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          background: "var(--ck-bg-surface)",
          borderTop: "1px solid var(--ck-border-subtle)",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "stretch",
          zIndex: 50,
          fontFamily: "var(--ck-font-sans)",
        } as CSSProperties
      }
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={t.onSelect}
          aria-current={t.active ? "page" : undefined}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            padding: "6px 8px",
            border: "none",
            background: "transparent",
            color: t.active ? "var(--ck-accent)" : "var(--ck-text-tertiary)",
            cursor: "pointer",
            font: "500 11px/1 var(--ck-font-sans)",
            transition: "color var(--ck-dur-fast) var(--ck-ease)",
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1, display: "inline-flex" }}>
            {t.icon}
          </span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
