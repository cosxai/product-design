import {
  useCallback,
  useContext,
  useLayoutEffect,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ActionBarContext } from "./actionbar-context";
import { ActionBarButton } from "./ActionBarButton";
import { ActionBarMenuGroup } from "./ActionBarMenuGroup";
import { useViewport } from "../hooks/useViewport";
import type { ActionBarItem } from "./types";

// Floating action bar. Reads items from the registry, groups items
// sharing a category (2+) into inline-expandable menus, supports:
//   - drag-to-reposition on desktop (left grip; double-click resets)
//   - phone-only collapsed handle (left-edge peek tab)
//   - localStorage persistence of position + collapsed state
//   - spring entry animation at the default centred position
//   - ESC + outside-click dismissal of expanded groups
//   - label hiding below md breakpoint (icons + tooltips only)
//
// Bar is purely a renderer. Pages register items via useActionBarItems().

const BAR_HEIGHT = 48;
const BAR_WIDTH_FALLBACK = 440;
const VIEWPORT_MARGIN = 8;
const DEFAULT_BOTTOM_GUTTER = 24;
const COLLAPSED_HANDLE_W = 22;
const COLLAPSED_HANDLE_H = 56;

type Pos = { type: "default" } | { type: "custom"; left: number; bottom: number };

function clampCustom(
  p: { left: number; bottom: number },
  barWidth: number,
): { left: number; bottom: number } {
  if (typeof window === "undefined") return p;
  return {
    left: Math.max(
      VIEWPORT_MARGIN,
      Math.min(window.innerWidth - VIEWPORT_MARGIN - barWidth, p.left),
    ),
    bottom: Math.max(
      VIEWPORT_MARGIN,
      Math.min(window.innerHeight - VIEWPORT_MARGIN - BAR_HEIGHT, p.bottom),
    ),
  };
}

function loadPos(storageKey: string): Pos {
  if (typeof window === "undefined") return { type: "default" };
  try {
    const raw = window.localStorage.getItem(`${storageKey}:pos`);
    if (!raw) return { type: "default" };
    const parsed = JSON.parse(raw);
    if (parsed?.type === "default") return { type: "default" };
    if (
      parsed?.type === "custom" &&
      typeof parsed.left === "number" &&
      typeof parsed.bottom === "number"
    ) {
      return { type: "custom", left: parsed.left, bottom: parsed.bottom };
    }
  } catch {}
  return { type: "default" };
}

function loadCollapsed(storageKey: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(`${storageKey}:collapsed`) === "1";
  } catch {
    return false;
  }
}

// Admin mode is session-only — deliberately NOT persisted. Two
// reasons: (1) cross-page reload persistence would surface an
// elevated-privileges state on a fresh session without explicit
// user opt-in every time — a small surprise factor with real
// consequences on admin surfaces. (2) The reset-on-context-change
// effect below relies on the state living in React memory alone,
// so we can watch for admin-item-set changes and clear cleanly.

interface BuildEntry {
  kind: "flat" | "group";
  expansionKey: string;
  item?: ActionBarItem;
  category?: string;
  groupItems?: ActionBarItem[];
}

// Build render entries: a category with 2+ items collapses into one
// group head at the position of its first item; later items in that
// category are folded into the group, not re-emitted. A category
// with one item just renders flat in place. No-category items always
// render flat.
function buildEntries(items: ActionBarItem[]): BuildEntry[] {
  const countByCat: Record<string, number> = {};
  for (const it of items) {
    if (it.category) countByCat[it.category] = (countByCat[it.category] ?? 0) + 1;
  }
  const result: BuildEntry[] = [];
  const consumed = new Set<string>();
  for (let i = 0; i < items.length; i++) {
    const it = items[i]!;
    const cat = it.category;
    if (cat && (countByCat[cat] ?? 0) >= 2) {
      if (consumed.has(cat)) continue;
      const groupItems = items.filter((x) => x.category === cat);
      result.push({
        kind: "group",
        expansionKey: `group:${cat}`,
        category: cat,
        groupItems,
      });
      consumed.add(cat);
      continue;
    }
    result.push({
      kind: "flat",
      expansionKey: it.key ?? `flat-${i}`,
      item: it,
    });
  }
  return result;
}

export interface ActionBarProps {
  // localStorage namespace for position + collapsed state.
  // Override per-app so multiple bars don't collide.
  storageKey?: string;
  // Enable desktop drag-to-reposition + double-click-to-reset.
  // Default true.
  draggable?: boolean;
  // Enable phone-only collapsed handle. Default true.
  collapsibleOnPhone?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function ActionBar({
  storageKey = "ck-actionbar",
  draggable = true,
  collapsibleOnPhone = true,
  className,
  style,
}: ActionBarProps) {
  const ctx = useContext(ActionBarContext);
  if (!ctx) {
    throw new Error("<ActionBar> must be inside <ActionBarProvider>");
  }
  const { items, categories, expandedKey, setExpandedKey, statusDot, panel, toast } = ctx;
  const vp = useViewport();
  const isPhone = vp.isPhone;

  // ----- Position state -----
  const [pos, setPos] = useState<Pos>(() => loadPos(storageKey));
  const barRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    try {
      window.localStorage.setItem(`${storageKey}:pos`, JSON.stringify(pos));
    } catch {}
  }, [pos, storageKey]);

  // Re-clamp on width resize so the bar tracks the viewport as
  // the window resizes. Initial clamp also runs after first paint
  // to handle saved positions from a wider window.
  useEffect(() => {
    const reclamp = () => {
      setPos((p) => {
        if (p.type !== "custom") return p;
        const w = barRef.current?.offsetWidth ?? BAR_WIDTH_FALLBACK;
        return { type: "custom", ...clampCustom(p, w) };
      });
    };
    reclamp();
    window.addEventListener("resize", reclamp);
    return () => window.removeEventListener("resize", reclamp);
  }, []);

  // ----- Admin mode toggle (any registered item with adminOnly=true) -----
  // Admin items stay hidden by default; a small toggle button (rendered
  // between the grip and the first item) flips this to reveal them.
  // Session-only: never persisted (see comment on loadAdminMode's
  // removal above). Additionally auto-resets when the set of
  // adminOnly item keys changes so a user who turned admin on for
  // Doc A doesn't accidentally land in admin mode on Doc B.
  const [adminMode, setAdminMode] = useState<boolean>(false);
  const toggleAdminMode = useCallback(() => {
    setAdminMode((prev) => !prev);
  }, []);
  const adminItemKeys = useMemo(
    () =>
      items
        .filter((it) => it.adminOnly === true)
        .map((it) => it.key)
        .sort()
        .join(","),
    [items],
  );
  const prevAdminKeysRef = useRef(adminItemKeys);
  useEffect(() => {
    if (prevAdminKeysRef.current !== adminItemKeys) {
      prevAdminKeysRef.current = adminItemKeys;
      // Context changed (typically: user navigated to a different
      // page whose useActionBarItems registered a different set of
      // admin actions). Reset admin mode so the elevated state is
      // never carried across viewer sessions implicitly.
      setAdminMode(false);
    }
  }, [adminItemKeys]);
  const hasAdminItems = useMemo(() => items.some((it) => it.adminOnly === true), [items]);
  // Filter semantics:
  //   admin OFF → hide items marked adminOnly (the toggle would reveal them)
  //   admin ON  → hide items marked hiddenInAdmin (page opted them out of admin view)
  // Together, adminOnly + hiddenInAdmin let pages choose:
  //   - additive: normal items unmarked → visible in both modes;
  //     admin items marked adminOnly → visible only in admin
  //   - exclusive: normal items marked hiddenInAdmin → hidden in admin;
  //     admin items marked adminOnly → visible only in admin
  const visibleItems = useMemo(
    () =>
      adminMode
        ? items.filter((it) => it.hiddenInAdmin !== true)
        : items.filter((it) => it.adminOnly !== true),
    [items, adminMode],
  );

  // ----- Collapsed state (phone only) -----
  const [collapsed, setCollapsed] = useState<boolean>(() => loadCollapsed(storageKey));
  useEffect(() => {
    try {
      window.localStorage.setItem(
        `${storageKey}:collapsed`,
        collapsed ? "1" : "0",
      );
    } catch {}
  }, [collapsed, storageKey]);

  // ----- Drag handlers (desktop) -----
  const dragRef = useRef<{ active: boolean; offsetX: number; offsetY: number }>({
    active: false,
    offsetX: 0,
    offsetY: 0,
  });
  const onGripDown = useCallback((e: React.MouseEvent) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect) return;
    const currentLeft = rect.left;
    const currentBottom = window.innerHeight - rect.bottom;
    dragRef.current = {
      active: true,
      offsetX: e.clientX - currentLeft,
      offsetY: e.clientY - (window.innerHeight - currentBottom - BAR_HEIGHT),
    };
    e.preventDefault();
  }, []);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.active) return;
      const w = barRef.current?.offsetWidth ?? BAR_WIDTH_FALLBACK;
      const left = e.clientX - dragRef.current.offsetX;
      const topY = e.clientY - dragRef.current.offsetY;
      const bottom = window.innerHeight - topY - BAR_HEIGHT;
      setPos({ type: "custom", ...clampCustom({ left, bottom }, w) });
    };
    const onUp = () => {
      dragRef.current.active = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);
  const onGripDoubleClick = useCallback(() => {
    try {
      window.localStorage.removeItem(`${storageKey}:pos`);
    } catch {}
    setPos({ type: "default" });
  }, [storageKey]);

  // ----- Entries (flat vs group), partitioned by slot -----
  // Items default to the leading slot. Trailing items render after a
  // flex spacer so they pin to the right edge regardless of
  // registration order — system status indicators (sync, identity,
  // connection) belong here, where page items registering later
  // can't shuffle them. buildEntries runs per slot so category
  // grouping stays slot-local (a category split across slots is an
  // edge case we intentionally don't fold across the spacer).
  const { leadingEntries, trailingEntries } = useMemo(() => {
    const leading: ActionBarItem[] = [];
    const trailing: ActionBarItem[] = [];
    for (const it of visibleItems) {
      (it.slot === "trailing" ? trailing : leading).push(it);
    }
    return {
      leadingEntries: buildEntries(leading),
      trailingEntries: buildEntries(trailing),
    };
  }, [visibleItems]);
  const entries = useMemo(
    () => [...leadingEntries, ...trailingEntries],
    [leadingEntries, trailingEntries],
  );

  // Cleanup stale expansion if the corresponding group disappears.
  useEffect(() => {
    if (expandedKey === null) return;
    if (!entries.some((e) => e.kind === "group" && e.expansionKey === expandedKey)) {
      setExpandedKey(null);
    }
  }, [expandedKey, entries, setExpandedKey]);

  // ESC closes any open group.
  useEffect(() => {
    if (expandedKey === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setExpandedKey(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedKey, setExpandedKey]);

  // ----- Empty state -----
  // Bar renders when EITHER any page item is registered OR the
  // status dot is set. Without the statusDot check, an app whose
  // only consumer is `useActionBarStatusDot` (e.g. a system-status-
  // only surface) would never see the bar at all.
  if (items.length === 0 && !statusDot) return null;

  // ----- Collapsed handle (phone only) -----
  if (isPhone && collapsibleOnPhone && collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        aria-label="Expand action bar"
        title="Tap to expand"
        className="ck-action-handle-enter"
        style={{
          position: "fixed",
          left: 0,
          bottom: `calc(${DEFAULT_BOTTOM_GUTTER}px + var(--ck-tabbar-height, 0px) + env(safe-area-inset-bottom, 0px))`,
          width: COLLAPSED_HANDLE_W,
          height: COLLAPSED_HANDLE_H,
          padding: 0,
          paddingLeft: 4,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 80,
          background: "var(--ck-bg-surface)",
          border: "1px solid var(--ck-border-subtle)",
          borderLeft: 0,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: 999,
          borderBottomRightRadius: 999,
          boxShadow: "3px 0 12px rgba(0,0,0,0.18)",
          cursor: "pointer",
          color: "var(--ck-text-secondary)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2 L13.6 8.4 L20 10 L13.6 11.6 L12 18 L10.4 11.6 L4 10 L10.4 8.4 Z" />
          <path
            d="M19 16 L19.6 18.4 L22 19 L19.6 19.6 L19 22 L18.4 19.6 L16 19 L18.4 18.4 Z"
            opacity="0.55"
          />
        </svg>
      </button>
    );
  }

  // ----- Panel slot (design#13): outside-click + Escape close. -----
  const panelOpen = Boolean(panel?.open);
  const panelClose = panel?.onOpenChange;
  useEffect(() => {
    if (!panelOpen || !panelClose) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (t && barRef.current?.contains(t)) return;
      panelClose(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") panelClose(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [panelOpen, panelClose]);

  // Horizontal clamp: centred on the bar unless that would push the
  // panel past a viewport edge — then shift just enough to fit.
  const panelRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (!panelOpen) return;
    const el = panelRef.current;
    if (!el) return;
    el.style.marginLeft = "0px";
    const rect = el.getBoundingClientRect();
    let shift = 0;
    if (rect.left < 8) shift = 8 - rect.left;
    else if (rect.right > window.innerWidth - 8) shift = window.innerWidth - 8 - rect.right;
    if (shift !== 0) el.style.marginLeft = `${Math.round(shift)}px`;
  }, [panelOpen, pos]);

  // ----- Full bar -----
  const isDefault = pos.type === "default";
  return (
    <div
      ref={barRef}
      data-ck-actionbar
      className={`ck-actionbar${isDefault ? " ck-actionbar-enter" : ""}${className ? ` ${className}` : ""}`}
      style={{
        position: "fixed",
        ...(isDefault
          ? {
              left: "50%",
              transform: "translateX(-50%)",
              bottom: `calc(${DEFAULT_BOTTOM_GUTTER}px + var(--ck-tabbar-height, 0px) + env(safe-area-inset-bottom, 0px))`,
            }
          : {
              left: pos.left,
              bottom: pos.bottom,
            }),
        height: BAR_HEIGHT,
        // Symmetric horizontal padding so the bar's interior content
        // area is centred. Previously only the right side had 6px
        // padding (legacy from when the right edge held normal items
        // and the left edge was an interactive grip), which made the
        // grip sit flush against the left curve while the rightmost
        // element (now the status dot) had visible breathing room.
        // The asymmetry pushed the leading items a few pixels left of
        // the bar's true centre.
        padding: "0 6px",
        display: "flex",
        alignItems: "center",
        gap: 4,
        zIndex: 80,
        // Bar background stays constant across modes — the earlier
        // whole-bar tint composited under the item hover overlay
        // (cool grey on tinted warm base) produced an awkward green
        // cast on hover, and competed with the shield toggle for
        // signal. Border colour DOES swap to accent when admin mode
        // is on so the elevated state reads at a glance without a
        // heavy surface change; the shield glyph adds a second cue
        // (outline off → filled on) at the toggle itself.
        background: "var(--ck-bg-surface)",
        border: `1px solid ${
          adminMode
            ? "var(--ck-accent, #4f46e5)"
            : "var(--ck-border-subtle)"
        }`,
        borderRadius: 999,
        boxShadow: "var(--ck-shadow-3)",
        fontFamily: "var(--ck-font-sans)",
        color: "var(--ck-text-primary)",
        transition: "border-color 200ms var(--ck-ease, ease)",
        ...style,
      }}
    >
      {/* Panel slot (design#13) — the bar positions + the chrome
          themes style it (.ck-actionbar-panel); consumers own only
          the content. Rendered inside the bar root so it follows
          drags natively. */}
      {panel?.open && (
        <div
          ref={panelRef}
          className="ck-actionbar-panel"
          role="region"
          aria-label={panel.ariaLabel ?? "Panel"}
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: panel.width ?? 320,
            maxWidth: "calc(100vw - 16px)",
            cursor: "default",
          }}
        >
          {panel.content}
        </div>
      )}
      {toast != null && !panel?.open && (
        <div
          className="ck-actionbar-toast"
          role="status"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          {toast}
        </div>
      )}
      {/* Left-edge button. Phone = collapse; desktop = drag grip. */}
      {isPhone && collapsibleOnPhone ? (
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label="Collapse action bar"
          title="Collapse"
          style={leftEdgeButtonStyle}
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
            aria-hidden
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      ) : draggable ? (
        <button
          type="button"
          onMouseDown={onGripDown}
          onDoubleClick={onGripDoubleClick}
          aria-label="Drag action bar (double-click to reset)"
          title="Drag · double-click to reset"
          style={{ ...leftEdgeButtonStyle, cursor: "grab" }}
        >
          <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" aria-hidden>
            <circle cx="2" cy="2" r="1" />
            <circle cx="2" cy="7" r="1" />
            <circle cx="2" cy="12" r="1" />
            <circle cx="8" cy="2" r="1" />
            <circle cx="8" cy="7" r="1" />
            <circle cx="8" cy="12" r="1" />
          </svg>
        </button>
      ) : null}

      {/* Admin-mode toggle. Only renders when at least one registered
          item has adminOnly=true. Borderless, transparent bg — same
          visual weight as the drag grip and the item icons around
          it. State polarity lives on the glyph itself: outline shield
          (off) → filled shield (on). No background pill, no whole-bar
          tint — the icon is the whole affordance. */}
      {hasAdminItems && (
        <button
          type="button"
          onClick={toggleAdminMode}
          aria-label={adminMode ? "Exit admin mode" : "Enter admin mode"}
          aria-pressed={adminMode}
          title={adminMode ? "Admin mode · click to exit" : "Enter admin mode"}
          data-ck-actionbar-admin-toggle
          data-active={adminMode ? "1" : "0"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            padding: 0,
            marginLeft: 2,
            marginRight: 2,
            borderRadius: 999,
            background: "transparent",
            color: adminMode
              ? "var(--ck-accent, #4f46e5)"
              : "var(--ck-text-secondary, #666)",
            border: "none",
            cursor: "pointer",
            transition: "color 200ms var(--ck-ease, ease)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            // Outline when off, filled when on. Stroke stays on in
            // both states so the silhouette is identical — only the
            // interior fills — which reads as "same shape, different
            // state" instead of two distinct glyphs.
            fill={adminMode ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </button>
      )}

      {/* Balancing leading spacer — only present when the right side
          holds ONLY a status dot (no trailing items). With a left
          and right spacer of equal flex weight, the leading items
          centre between the grip and the status dot. Without this,
          a solo leading item (e.g. just "Theme · Light") looks
          left-anchored next to the grip with a visible gap before
          the dot, which reads as unbalanced. When trailing items ARE
          present, they take that role on the right and the leading
          group goes back to its natural left-anchored packing. */}
      {leadingEntries.length > 0 && trailingEntries.length === 0 && statusDot && (
        <span
          aria-hidden
          data-ck-actionbar-spacer="leading"
          style={{ flex: "1 1 auto", minWidth: 0 }}
        />
      )}

      {/* Leading entries — flat items + group heads with disclosure regions. */}
      {leadingEntries.map(renderEntry)}

      {/* Spacer pushes whatever is right-aligned (trailing entries +/or
          the bar-intrinsic status dot) to the right edge. Only rendered
          when there IS something on the right, so the bar still hugs
          its content tightly when neither is in use. */}
      {(trailingEntries.length > 0 || statusDot) && (
        <span
          aria-hidden
          data-ck-actionbar-spacer
          style={{ flex: "1 1 auto", minWidth: 0 }}
        />
      )}

      {/* Trailing entries — pin to the right edge regardless of
          registration order. Same rendering rules as leading. */}
      {trailingEntries.map(renderEntry)}

      {/* Status dot — bar-intrinsic chrome at the right edge,
          mirroring the left-edge drag grip. Consumer-controlled via
          `useActionBarStatusDot()`. Visual: a small coloured dot in
          a 28×BAR_HEIGHT slot. Renders as a button when an onClick
          is provided; otherwise a plain span (no interactive
          affordances). */}
      {statusDot &&
        (statusDot.onClick ? (
          <button
            type="button"
            onClick={statusDot.onClick}
            aria-label={statusDot.title ?? "Status"}
            title={statusDot.title ?? "Status"}
            data-ck-actionbar-status-dot
            style={rightEdgeButtonStyle}
          >
            <StatusDotGlyph color={statusDot.color} pulse={statusDot.pulse} />
          </button>
        ) : (
          <span
            aria-label={statusDot.title ?? "Status"}
            title={statusDot.title ?? "Status"}
            data-ck-actionbar-status-dot
            style={rightEdgeButtonStyle}
          >
            <StatusDotGlyph color={statusDot.color} pulse={statusDot.pulse} />
          </span>
        ))}
    </div>
  );

  function renderEntry(entry: BuildEntry): ReactNode {
    // Admin-only entries play a slide-in animation on mount so the
    // reveal doesn't feel like items just popped in. Groups that
    // contain any adminOnly items also get wrapped so the whole
    // disclosure slides in together.
    const isAdmin =
      entry.item?.adminOnly === true ||
      entry.groupItems?.some((it) => it.adminOnly === true) === true;
    let node: ReactNode;
    if (entry.kind === "flat" && entry.item) {
      node = (
        <ActionBarButton
          key={entry.expansionKey}
          icon={entry.item.icon}
          label={entry.item.label}
          title={entry.item.title}
          active={entry.item.active}
          disabled={entry.item.disabled}
          variant={entry.item.variant}
          hint={entry.item.hint}
          onClick={entry.item.onClick}
        />
      );
    } else {
      const cat = entry.category!;
      const catDef = categories[cat];
      const hasActiveChild = entry.groupItems!.some((it) => it.active);
      const isOpen = expandedKey === entry.expansionKey;
      node = (
        <ActionBarMenuGroup
          key={entry.expansionKey}
          label={catDef?.label ?? cat}
          icon={catDef?.icon}
          hasActiveChild={hasActiveChild}
          isOpen={isOpen}
          onToggle={() => setExpandedKey(isOpen ? null : entry.expansionKey)}
          items={entry.groupItems!}
          onItemClicked={(it) => {
            it.onClick();
            if (!it.keepGroupOpenOnClick) {
              setExpandedKey(null);
            }
          }}
        />
      );
    }
    if (!isAdmin) return node;
    // Wrapper carries the spring-in animation via keyframes injected
    // at module load (see bottom of file). Key includes adminMode so
    // React remounts the wrapper each time it flips, replaying the
    // animation cleanly.
    return (
      <span
        key={`${entry.expansionKey}-admin`}
        className="ck-actionbar-admin-item"
        style={{ display: "inline-flex" }}
      >
        {node}
      </span>
    );
  }
}

const leftEdgeButtonStyle: CSSProperties = {
  width: 28,
  height: BAR_HEIGHT,
  padding: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  background: "transparent",
  color: "var(--ck-text-tertiary)",
  borderRadius: 0,
};

// Right-edge button — mirrors leftEdgeButtonStyle in dimensions, used
// for the status dot. Cursor stays default for the non-interactive
// span variant; the interactive (onClick) path is a real <button>
// that picks up :hover / :focus styles from base.css.
const rightEdgeButtonStyle: CSSProperties = {
  ...leftEdgeButtonStyle,
};

// StatusDotGlyph — the actual coloured circle, sized to read at par
// with the grip's six-dot icon. Pulse via a shared keyframe injected
// at module scope (one stylesheet entry; idempotent across mounts).
interface StatusDotGlyphProps {
  color: string;
  pulse?: boolean | undefined;
}
function StatusDotGlyph({ color, pulse }: StatusDotGlyphProps) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        animation: pulse ? "ck-actionbar-status-pulse 1.4s ease-in-out infinite" : undefined,
      }}
    />
  );
}

// One global stylesheet entry for the pulse keyframe + admin-item
// entrance animation. Injected once on first import. Idempotent —
// re-imports check by id.
if (typeof document !== "undefined") {
  const STYLE_ID = "ck-actionbar-status-pulse";
  if (!document.getElementById(STYLE_ID)) {
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = `
      @keyframes ck-actionbar-status-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.45; }
      }
      @keyframes ck-actionbar-admin-enter {
        0% {
          opacity: 0;
          transform: translateX(-6px) scale(0.92);
        }
        60% {
          opacity: 1;
        }
        100% {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
      .ck-actionbar-admin-item {
        animation: ck-actionbar-admin-enter 260ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
        transform-origin: left center;
      }
    `;
    document.head.appendChild(el);
  }
}
