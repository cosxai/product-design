import { NavLink, useLocation } from "react-router-dom";
import {
  LeftNavRail,
  NavSection,
  NavItem,
  NavSearchTrigger,
  Avatar,
  useNavRailState,
  useTheme,
  useCommandPalette,
} from "@cosx/ui";

// Docs site's left navigation. Dogfoods <LeftNavRail> +
// <NavSection> + <NavItem> + <NavSearchTrigger> + <Avatar>.
//
// Visual goals (mirroring deck-kit):
//   - Brand logo at the top, swaps between full wordmark and
//     favicon mark depending on collapsed + theme
//   - Search button below the logo opens the command palette
//   - Section labels (uppercase mono) cluster the nav items
//   - Footer: avatar + display name + email + sign-out icon
//   - Background matches the topbar (--ck-bg-surface)
//
// Fake user data — real consumer apps wire useViewerProfile or
// their own auth source.

interface NavLinkSpec {
  to: string;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  heading: string;
  links: NavLinkSpec[];
}

// Tiny dot stand-ins for proper icons. Real consumer apps supply
// per-item SVGs (Lucide, Heroicons, custom set).
function Dot() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "currentColor",
        opacity: 0.7,
      }}
    />
  );
}

const GROUPS: NavGroup[] = [
  {
    heading: "Getting started",
    links: [
      { to: "/", label: "Overview", icon: <Dot /> },
      { to: "/installation", label: "Installation", icon: <Dot /> },
      { to: "/theming", label: "Theming", icon: <Dot /> },
      { to: "/tokens", label: "Tokens", icon: <Dot /> },
    ],
  },
  {
    heading: "Primitives",
    links: [
      { to: "/components/button", label: "Button", icon: <Dot /> },
      { to: "/components/primitives", label: "All primitives", icon: <Dot /> },
      { to: "/components/bonus", label: "Tooltip · time", icon: <Dot /> },
    ],
  },
  {
    heading: "Layout",
    links: [
      { to: "/components/layout/shell", label: "Shell + rails", icon: <Dot /> },
      { to: "/components/layout/breadcrumb", label: "Breadcrumb", icon: <Dot /> },
      { to: "/components/layout/right-panel", label: "Right panel", icon: <Dot /> },
      { to: "/components/layout/sticky-banner", label: "Sticky banner", icon: <Dot /> },
    ],
  },
  {
    heading: "Patterns",
    links: [
      { to: "/components/dialogs", label: "Dialogs + Modal", icon: <Dot /> },
      { to: "/components/action-bar", label: "Action bar", icon: <Dot /> },
      { to: "/components/command-palette", label: "Command palette", icon: <Dot /> },
    ],
  },
  {
    heading: "Advanced",
    links: [
      { to: "/pwa", label: "PWA setup", icon: <Dot /> },
      { to: "/editorial", label: "Editorial chrome", icon: <Dot /> },
      { to: "/neobrutalism", label: "Neobrutalism chrome", icon: <Dot /> },
      { to: "/ambient", label: "Ambient Glass chrome", icon: <Dot /> },
      { to: "/swiss", label: "Swiss chrome", icon: <Dot /> },
      { to: "/terminal", label: "Terminal chrome", icon: <Dot /> },
      { to: "/bento", label: "Bento Grid chrome", icon: <Dot /> },
      { to: "/frutiger", label: "Frutiger Aero chrome", icon: <Dot /> },
      { to: "/riso", label: "Risograph chrome", icon: <Dot /> },
      { to: "/sketch", label: "Hand-drawn chrome", icon: <Dot /> },
    ],
  },
];

// Fake demo user — swap with your auth source in a real app.
const FAKE_USER = {
  name: "Ada Lovelace",
  email: "ada@example.com",
};

export function DocsSidebar() {
  const { collapsed, forcedByViewport, toggle } = useNavRailState({
    storageKey: "cosx-docs-leftnav-collapsed",
  });
  const { theme } = useTheme();
  const { setOpen: openPalette } = useCommandPalette();
  const { pathname } = useLocation();

  const logoSrc = collapsed
    ? theme === "dark"
      ? "/favicon-dark.svg"
      : "/favicon-light.svg"
    : theme === "dark"
      ? "/cosx-logo-dark-2.svg"
      : "/cosx-logo.svg";

  return (
    <LeftNavRail
      collapsed={collapsed}
      brand={
        // No own height — LeftNavRail provides a 64 px container
        // matching the topbar (via --ck-breadcrumb-height). Logo
        // sits centred inside, sized below the container height
        // for breathing room. The COSX wordmark SVG includes a
        // tagline so we keep it short (22 px) to avoid the
        // wordmark filling the bar vertically.
        <NavLink
          to="/"
          aria-label="@cosx/ui"
          title="@cosx/ui"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <img
            src={logoSrc}
            alt="@cosx/ui"
            style={{ height: collapsed ? 22 : 22, width: "auto", display: "block" }}
          />
        </NavLink>
      }
      footer={
        <Footer
          collapsed={collapsed}
          forcedByViewport={forcedByViewport}
          onToggleCollapsed={toggle}
        />
      }
    >
      <div style={{ padding: collapsed ? 0 : "0 0 12px" }}>
        <NavSearchTrigger
          collapsed={collapsed}
          onClick={() => openPalette(true)}
        />
      </div>

      {GROUPS.map((g) => (
        <NavSection key={g.heading} label={g.heading} collapsed={collapsed}>
          {g.links.map((l) => {
            const isHome = l.to === "/";
            const active = isHome
              ? pathname === "/"
              : pathname === l.to || pathname.startsWith(`${l.to}/`);
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={isHome}
                style={{ textDecoration: "none" }}
              >
                <NavItem
                  icon={l.icon}
                  label={l.label}
                  active={active}
                  collapsed={collapsed}
                />
              </NavLink>
            );
          })}
        </NavSection>
      ))}
    </LeftNavRail>
  );
}

function Footer({
  collapsed,
  forcedByViewport,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  forcedByViewport: boolean;
  onToggleCollapsed: () => void;
}) {
  if (collapsed) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          padding: "8px 0",
        }}
      >
        <Avatar name={FAKE_USER.name} size={32} />
        <SignOutButton />
        {!forcedByViewport && (
          <CollapseToggle collapsed onClick={onToggleCollapsed} />
        )}
      </div>
    );
  }
  return (
    <div style={{ padding: "12px 8px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={FAKE_USER.name} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              font: "500 13px/1.3 var(--ck-font-sans)",
              color: "var(--ck-text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={FAKE_USER.name}
          >
            {FAKE_USER.name}
          </div>
          <div
            style={{
              font: "400 11px/1.3 var(--ck-font-mono)",
              color: "var(--ck-text-tertiary)",
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={FAKE_USER.email}
          >
            {FAKE_USER.email}
          </div>
        </div>
        <SignOutButton />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          font: "400 10px/1 var(--ck-font-mono)",
          color: "var(--ck-text-tertiary)",
        }}
      >
        <span style={{ opacity: 0.6 }}>@cosx/ui · v0.0.0</span>
        {!forcedByViewport && (
          <CollapseToggle collapsed={false} onClick={onToggleCollapsed} />
        )}
      </div>
    </div>
  );
}

function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => alert("Pretend sign-out flow")}
      aria-label="Sign out"
      title="Sign out"
      style={{
        background: "transparent",
        border: "none",
        color: "var(--ck-text-tertiary)",
        cursor: "pointer",
        padding: 4,
        display: "inline-flex",
        alignItems: "center",
        transition: "color var(--ck-dur-fast) var(--ck-ease)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--ck-critical)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--ck-text-tertiary)";
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    </button>
  );
}

function CollapseToggle({
  collapsed,
  onClick,
}: {
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      style={{
        background: "transparent",
        border: "none",
        color: "var(--ck-text-tertiary)",
        cursor: "pointer",
        padding: 4,
        display: "inline-flex",
        alignItems: "center",
        transition: "color var(--ck-dur-fast) var(--ck-ease)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--ck-text-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--ck-text-tertiary)";
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {collapsed ? (
          <>
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </>
        ) : (
          <>
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
          </>
        )}
      </svg>
    </button>
  );
}
