import type { ReactNode, CSSProperties } from "react";
import { CountBadge } from "../primitives/CountBadge";

// Single nav row inside <LeftNavRail>. Router-agnostic — pass your
// own router's link primitive via the `as` prop, or fall back to a
// plain anchor. Collapsed mode renders icon-only with the label as
// a tooltip.
//
// Use with NavLink-style render-prop routers by wrapping NavItem
// with your router's link and forwarding `active`:
//
//   <NavLink to="/x">
//     {({ isActive }) =>
//       <NavItem active={isActive} icon={<X/>} label="X" />
//     }
//   </NavLink>

export interface NavItemProps {
  // Visible label (also used as tooltip when collapsed).
  label: string;
  icon: ReactNode;
  active?: boolean;
  // Optional notification count badge — renders nothing for 0.
  badge?: number;
  collapsed?: boolean;
  onClick?: () => void;
  // Render as an anchor with this href. When omitted, renders as
  // a button (use onClick).
  href?: string;
  // Optional custom render — escape hatch for router-link wrappers
  // that need to spread their own props on the element. Receives
  // the rendered children + the inline style.
  className?: string;
  style?: CSSProperties;
}

export function NavItem({
  label,
  icon,
  active,
  badge,
  collapsed,
  onClick,
  href,
  className,
  style,
}: NavItemProps) {
  const showBadge = badge !== undefined && badge > 0;
  const baseStyle: CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    borderRadius: "var(--ck-radius-md)",
    transition: "background var(--ck-dur-fast) var(--ck-ease), color var(--ck-dur-fast) var(--ck-ease)",
    background: active ? "var(--ck-accent-muted)" : "transparent",
    color: active ? "var(--ck-accent)" : "var(--ck-text-secondary)",
    font: "400 13px/1 var(--ck-font-sans)",
    fontWeight: active ? 500 : 400,
    cursor: "pointer",
    textDecoration: "none",
    border: "none",
    ...(collapsed
      ? {
          justifyContent: "center",
          width: 40,
          height: 40,
        }
      : {
          justifyContent: "space-between",
          padding: "8px 12px",
        }),
    ...style,
  };

  const content = collapsed ? (
    <>
      <span style={{ display: "inline-flex" }}>{icon}</span>
      {showBadge && (
        <span style={{ position: "absolute", top: 2, right: 2 }}>
          <CountBadge count={badge} size="sm" tone="critical" />
        </span>
      )}
    </>
  ) : (
    <>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        {icon}
        <span>{label}</span>
      </span>
      {showBadge && <CountBadge count={badge} size="sm" tone="critical" />}
    </>
  );

  // data-ck-navitem + data-active are escape hatches for chrome
  // CSS to override the inline visual state (e.g. neobrutalism
  // wants a fully different chunky look on the active item).
  const dataAttrs = {
    "data-ck-navitem": "",
    "data-active": active ? "true" : undefined,
  };

  if (href !== undefined) {
    return (
      <a
        href={href}
        title={collapsed ? label : undefined}
        className={className}
        style={baseStyle}
        {...dataAttrs}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={className}
      style={baseStyle}
      {...dataAttrs}
    >
      {content}
    </button>
  );
}
