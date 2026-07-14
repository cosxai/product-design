import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

// SidePanel — right-docked overlay-less panel for admin surfaces
// (doc editors, activity feeds, share managers, …). Slides in from
// the right and pushes the main content left via
// `--ck-sidepanel-width`, which Shell / topbar / scroll containers
// can read to inset themselves. No backdrop — the reader keeps
// interacting with the doc while the panel is open, mirroring
// Notion / Linear / Slack right-panel UX.
//
// Distinct from `<RightSidebarPanel>` (this bucket's other right-
// side surface):
//   - RightSidebarPanel = scoped floating card (bordered, offset
//     from viewport edges); good for lightweight ephemeral lists.
//   - SidePanel        = full-height slide-in that reshapes layout;
//     good for editors + long panels the user will linger in.
//
// Companion CSS variable:
//   `--ck-sidepanel-width` — stamped on `:root` while `open` is true.
//     Layout consumers (Shell, main scroll containers, watermarks)
//     should sum this into their right inset:
//         right: calc(var(--ck-rightrail-width, 0px)
//                     + var(--ck-sidepanel-width, 0px));
//     The variable is DELIBERATELY separate from `--ck-rightrail-width`
//     so the SidePanel can push content-region chrome without
//     narrowing the topbar (workspace switcher, avatar, notification
//     pills belong to the topbar and shouldn't slide around when a
//     doc-scoped panel opens).
//
// Anatomy:
//
//   ┌─ header (sticky) ─────────────┐
//   │ Title                       × │
//   ├───────────────────────────────┤
//   │                               │
//   │ body (scrollable + flex col)  │
//   │                               │
//   ├─ footer (sticky, optional) ───┤
//   │ Cancel   Save                 │
//   └───────────────────────────────┘
//
// Non-goals:
// - Multiple concurrent panels. Only one at a time — a second would
//   double the marginRight the shell reads and the second panel would
//   render off-viewport. Callers coordinate open state.
// - Focus trap. The main content stays interactive; trapping focus
//   here would break the "keep working while the panel is open"
//   promise. ESC still closes.
// - Resize handle. Fixed width per open; iterate if callers need it.
//
// Phone: renders the same panel but at `width: min(100vw, width)`
// so it simply covers the viewport. The push-left effect degrades
// to a full-screen overlay — acceptable since these surfaces are
// desktop-first anyway.
//
// Body is a flex column so children can opt into `flex: 1` +
// `minHeight: 0` and grow to fill the panel (e.g. a textarea that
// should reach the footer). `overflowY: auto` stays as a safety
// net for content that genuinely exceeds the panel height.

export interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  /** Text shown in the header. Icons / node also accepted. */
  title: ReactNode;
  /**
   * Panel width in CSS px. Default 480 — the sweet spot for an
   * editor with a couple of fields. Callers override for wider
   * content (e.g. Activity timeline).
   */
  width?: number | undefined;
  /**
   * Optional sticky footer — usually action buttons (Cancel / Save).
   * Omit for read-only surfaces (Activity feed, share reader).
   */
  footer?: ReactNode | undefined;
  /**
   * Top inset. Defaults to
   * `calc(var(--ck-topbar-height, 64px) + env(safe-area-inset-top, 0px))`
   * so the panel docks under the app's topbar. Consumers with a
   * different topbar height stamp `--ck-topbar-height` on `:root`
   * OR override this prop directly.
   */
  topOffset?: string | undefined;
  /**
   * Bottom inset. Defaults to `var(--ck-tabbar-height, 0px)` so
   * the panel doesn't cover the mobile tab bar. Override for
   * consumers with different bottom chrome.
   */
  bottomOffset?: string | undefined;
  /**
   * z-index. Default 25 — sits above main content, below the
   * standard Modal (100) and typical fixed topbar (30).
   */
  zIndex?: number | undefined;
  children: ReactNode;
}

const DEFAULT_WIDTH = 480;
const CSS_VAR_SIDEPANEL_WIDTH = '--ck-sidepanel-width';
const DEFAULT_TOP_OFFSET =
  'calc(var(--ck-topbar-height, 64px) + env(safe-area-inset-top, 0px))';
const DEFAULT_BOTTOM_OFFSET = 'var(--ck-tabbar-height, 0px)';
const DEFAULT_Z_INDEX = 25;

export function SidePanel({
  open,
  onClose,
  title,
  width,
  footer,
  topOffset,
  bottomOffset,
  zIndex,
  children,
}: SidePanelProps) {
  const panelWidth = width ?? DEFAULT_WIDTH;
  const resolvedTop = topOffset ?? DEFAULT_TOP_OFFSET;
  const resolvedBottom = bottomOffset ?? DEFAULT_BOTTOM_OFFSET;
  const resolvedZ = zIndex ?? DEFAULT_Z_INDEX;

  // Stamp / clear `--ck-sidepanel-width` on document root while open.
  // Consumers that want their layout to shift left when a panel opens
  // read this var and inset their right edge accordingly. The kit
  // itself doesn't force any layout to read it — it's an opt-in
  // contract between the panel and layout consumers.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.getPropertyValue(CSS_VAR_SIDEPANEL_WIDTH);
    root.style.setProperty(CSS_VAR_SIDEPANEL_WIDTH, `${panelWidth}px`);
    return () => {
      // Restore whatever value was there before us — could be empty
      // (fall through to token default) or a previous panel's width
      // if two panels overlap mid-transition.
      if (prev) {
        root.style.setProperty(CSS_VAR_SIDEPANEL_WIDTH, prev);
      } else {
        root.style.removeProperty(CSS_VAR_SIDEPANEL_WIDTH);
      }
    };
  }, [open, panelWidth]);

  // ESC to close. Global listener so users don't have to focus into
  // the panel first. Only mounted while open so it doesn't eat ESC
  // on the main surface.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Focus the close button on open so keyboard users have a
  // predictable landing target + can Tab into the body. Not a focus
  // trap — Tab from the last body input walks back out into the
  // main surface, which is the whole point of the pattern.
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!open) return;
    // Run after transition frame so the button is actually
    // interactive by the time focus lands.
    const raf = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const containerStyle: CSSProperties = {
    position: 'fixed',
    top: resolvedTop,
    right: 0,
    bottom: resolvedBottom,
    width: `min(100vw, ${panelWidth}px)`,
    background: 'var(--ck-bg-surface, #fff)',
    borderLeft: '1px solid var(--ck-border-subtle, #eee)',
    boxShadow: open ? '-4px 0 20px rgba(0, 0, 0, 0.06)' : 'none',
    transform: open ? 'translateX(0)' : 'translateX(100%)',
    transition:
      'transform var(--ck-dur-fast, 180ms) var(--ck-ease, cubic-bezier(0.22, 1, 0.36, 1))',
    display: 'flex',
    flexDirection: 'column',
    zIndex: resolvedZ,
    // Prevent the closed panel from stealing pointer events on the
    // main surface (translated off-screen but still in the DOM).
    pointerEvents: open ? 'auto' : 'none',
  };

  // Portal to <body> so the panel escapes any `transform` /
  // `will-change: transform` / `filter` / `contain: paint` ancestor
  // — those establish a new containing block for `position: fixed`,
  // meaning the panel would anchor to that ancestor instead of the
  // viewport (e.g. inside a ZoomLayer it would land mid-page rather
  // than on the right edge). The body has no such ancestor, so
  // `right: 0` + `top: <offset>` genuinely means "the viewport
  // corner".
  //
  // `inert` (React 19+) instead of `aria-hidden` for the closed
  // state: aria-hidden triggers a runtime warning when a focused
  // descendant exists (the close button focuses on open + keeps
  // focus briefly after close), and `inert` is the modern correct
  // API — removes the subtree from the tab sequence + AT tree +
  // pointer targeting in one attribute.
  return createPortal(
    <aside
      role="complementary"
      inert={!open}
      aria-label={typeof title === 'string' ? title : undefined}
      style={containerStyle}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--ck-border-subtle, #eee)',
          gap: 12,
          flex: '0 0 auto',
        }}
      >
        <div
          style={{
            font: '600 14px/1.4 var(--ck-font-sans)',
            color: 'var(--ck-text-primary, #111)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: 6,
            border: 'none',
            background: 'transparent',
            color: 'var(--ck-text-secondary, #666)',
            cursor: 'pointer',
            transition: 'background 120ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--ck-bg-hover, #f4f4f5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <CloseIcon />
        </button>
      </header>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>
      {footer ? (
        <footer
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            borderTop: '1px solid var(--ck-border-subtle, #eee)',
            flex: '0 0 auto',
          }}
        >
          {footer}
        </footer>
      ) : null}
    </aside>,
    document.body,
  );
}

function CloseIcon(): ReactNode {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
