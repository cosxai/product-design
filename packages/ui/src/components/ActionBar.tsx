import { ChevronDown, ChevronsLeft, ChevronsRight, GripVertical, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import { cn } from '../lib/cn';
import { Menu, MenuContent, MenuItem, MenuTrigger } from './Menu';
import { Tooltip } from './Tooltip';

// ─── Types ────────────────────────────────────────────────────────────

export type ActionBarAction = {
  /** Stable id (per registering page). */
  id: string;
  label: string;
  icon?: LucideIcon | undefined;
  /** The key that runs it, even while the bar is folded or hidden: "n", "shift+s", "mod+a". Shown as N, ⇧S, ⌘A. */
  shortcut?: string | undefined;
  onSelect: () => void;
  /** A toggle that is on: lit with the brand colour — the only colour on the bar. */
  active?: boolean | undefined;
  disabled?: boolean | undefined;
  /** Why it is unavailable (disables it; shown on hover). */
  disabledReason?: string | undefined;
  /** Actions of a kind: more than two sharing a group fold into one menu. */
  group?: string | undefined;
  /** A thin rule before it, setting it apart from the actions on its left. */
  divider?: boolean | undefined;
  /** Always just the icon (a star, ⋯); the label names it for screen readers and the tooltip. */
  iconOnly?: boolean | undefined;
  /** Wrap the button, e.g. in a menu's or popover's trigger (asChild), so it opens something anchored to itself. */
  wrap?: ((button: ReactElement) => ReactElement) | undefined;
  /** Changes when what `wrap` shows changes (the bar re-renders only when an action's fields change). */
  wrapKey?: string | undefined;
};

export type ActionBarSelection = {
  /** How many items are selected; 0 returns the bar to idle. */
  count: number;
  /** Only actions valid for every selected item (folders included). */
  actions: ActionBarAction[];
  /** Clear the selection (Cancel, Esc). */
  onClear: () => void;
  /** @default (n) => `${n} selected` */
  countLabel?: ((count: number) => string) | undefined;
  /** @default "Cancel" */
  clearLabel?: string | undefined;
};

export type ActionBarMode = {
  /** "Comment", "Translate". */
  name: string;
  actions: ActionBarAction[];
  /** Leave the mode (Done, Esc). */
  onDone: () => void;
  /** @default "Done" */
  doneLabel?: string | undefined;
};

export type ActionBarState = 'idle' | 'selection' | 'mode';
/** full: icon, label, shortcut · labels: no shortcut text · icons: icons only · folded: the left-edge handle. */
export type ActionBarPresentation = 'full' | 'labels' | 'icons' | 'folded';

type Stored = { folded: boolean; x: number; y: number };

type Ctx = {
  version: number;
  setItems: (source: string, actions: ActionBarAction[] | null) => void;
  setSelection: (source: string, sel: ActionBarSelection | null) => void;
  setMode: (source: string, mode: ActionBarMode | null) => void;
  setHidden: (source: string, hidden: boolean) => void;
  setActivity: (source: string, label: string | null) => void;
  /** A mounted bar whose fold would take effect (foldable, presentation not forced) — the \\ shortcut needs one. */
  setFoldable: (source: string, can: boolean) => void;
  read: () => {
    idle: ActionBarAction[];
    selection: ActionBarSelection | null;
    mode: ActionBarMode | null;
    hidden: boolean;
    activity: string | null;
  };
  prefs: Stored;
  setPrefs: (next: Partial<Stored>) => void;
};

const ActionBarContext = createContext<Ctx | null>(null);

// ─── Keys ─────────────────────────────────────────────────────────────

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/** "shift+s" → "⇧S", "mod+a" → "⌘A" (Ctrl+A off Apple). */
export function formatShortcut(shortcut: string): string {
  return shortcut
    .split('+')
    .map((p) => {
      const k = p.trim().toLowerCase();
      if (k === 'mod') return isMac ? '⌘' : 'Ctrl+';
      if (k === 'shift') return '⇧';
      if (k === 'alt') return isMac ? '⌥' : 'Alt+';
      if (k === 'escape' || k === 'esc') return 'Esc';
      if (k === 'backspace') return '⌫';
      if (k === 'delete' || k === 'del') return isMac ? '⌦' : 'Del';
      if (k === 'enter' || k === 'return') return '↵';
      return k.length === 1 ? k.toUpperCase() : k[0]!.toUpperCase() + k.slice(1);
    })
    .join('');
}

function matches(shortcut: string, e: KeyboardEvent): boolean {
  const parts = shortcut.toLowerCase().split('+').map((p) => p.trim());
  const key = parts[parts.length - 1]!;
  const mod = parts.includes('mod');
  const wantMod = isMac ? e.metaKey : e.ctrlKey;
  if (mod !== wantMod) return false;
  if (parts.includes('shift') !== e.shiftKey) return false;
  if (parts.includes('alt') !== e.altKey) return false;
  if (!mod && (e.metaKey || e.ctrlKey)) return false;
  return e.key.toLowerCase() === key || e.code.toLowerCase() === `key${key}`;
}

function editable(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null;
  if (!el || !el.tagName) return false;
  return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
}

const dialogOpen = () => Boolean(document.querySelector('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]'));

const signature = (a: ActionBarAction[] | null | undefined) =>
  a ? a.map((x) => [x.id, x.label, x.shortcut, x.active, x.disabled, x.disabledReason, x.group, x.icon?.displayName, x.divider, x.iconOnly, x.wrapKey].join('\u0001')).join('\u0002') : '';

// ─── Provider ─────────────────────────────────────────────────────────

export type ActionBarProviderProps = {
  children: ReactNode;
  /** localStorage key for position and fold state; null keeps them in memory. @default "cosx-action-bar" */
  storageKey?: string | null | undefined;
  /** Start folded on first visit (the viewer, signing and presenting default to folded). */
  defaultFolded?: boolean | undefined;
};

/**
 * ActionBarProvider — the registry behind the one global action bar.
 * Pages register actions (useActionBarItems) and withdraw them on unmount;
 * a selection (useActionBarSelection) or a mode (useActionBarMode) swaps
 * the bar's contents as a whole. Shortcuts of the current state work even
 * when the bar is folded or hidden; Esc steps back mode → selection → idle;
 * \ folds and unfolds. Handlers are read at call time, so registering
 * inline arrays is safe.
 */
export function ActionBarProvider({ children, storageKey = 'cosx-action-bar', defaultFolded = false }: ActionBarProviderProps) {
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);
  const items = useRef(new Map<string, ActionBarAction[]>());
  const selections = useRef(new Map<string, ActionBarSelection>());
  const modes = useRef(new Map<string, ActionBarMode>());
  const hidden = useRef(new Set<string>());
  const activity = useRef(new Map<string, string>());
  const sigs = useRef(new Map<string, string>());
  const foldables = useRef(new Set<string>());

  const changed = (key: string, sig: string) => {
    if (sigs.current.get(key) === sig) return false;
    sigs.current.set(key, sig);
    return true;
  };

  const ctxFns = useMemo(() => {
    const put = <T,>(map: Map<string, T>, kind: string, source: string, v: T | null, sig: string) => {
      if (v === null) map.delete(source);
      else map.set(source, v);
      if (changed(`${kind}:${source}`, v === null ? '∅' : sig)) bump();
    };
    return {
      setItems: (s: string, a: ActionBarAction[] | null) => put(items.current, 'i', s, a, signature(a)),
      setSelection: (s: string, v: ActionBarSelection | null) =>
        put(selections.current, 's', s, v, v ? `${v.count}|${v.clearLabel}|${signature(v.actions)}` : ''),
      setMode: (s: string, v: ActionBarMode | null) => put(modes.current, 'm', s, v, v ? `${v.name}|${v.doneLabel}|${signature(v.actions)}` : ''),
      setHidden: (s: string, h: boolean) => {
        const had = hidden.current.has(s);
        if (h) hidden.current.add(s);
        else hidden.current.delete(s);
        if (had !== h) bump();
      },
      setActivity: (s: string, label: string | null) => put(activity.current, 'a', s, label, label ?? ''),
      setFoldable: (s: string, can: boolean) => {
        if (can) foldables.current.add(s);
        else foldables.current.delete(s);
      },
      read: () => {
        const last = <T,>(m: Map<string, T>) => [...m.values()].at(-1) ?? null;
        const sel = [...selections.current.values()].filter((x) => x.count > 0).at(-1) ?? null;
        return {
          idle: [...items.current.values()].flat(),
          selection: sel,
          mode: last(modes.current),
          hidden: hidden.current.size > 0,
          activity: last(activity.current),
        };
      },
    };
  }, [bump]);

  const [prefs, setPrefsState] = useState<Stored>(() => {
    const fallback = { folded: defaultFolded, x: 0, y: 0 };
    if (!storageKey) return fallback;
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? { ...fallback, ...(JSON.parse(raw) as Partial<Stored>) } : fallback;
    } catch {
      return fallback;
    }
  });
  const setPrefs = useCallback(
    (next: Partial<Stored>) =>
      setPrefsState((cur) => {
        const merged = { ...cur, ...next };
        if (storageKey) {
          try {
            localStorage.setItem(storageKey, JSON.stringify(merged));
          } catch {
            /* storage unavailable */
          }
        }
        return merged;
      }),
    [storageKey],
  );

  // Keys: the current state's shortcuts, Esc stepping back, \ folding.
  const readRef = useRef(ctxFns.read);
  readRef.current = ctxFns.read;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const { idle, selection, mode } = readRef.current();
      if (e.key === 'Escape') {
        if (dialogOpen() || editable(e.target)) return;
        if (mode) {
          e.preventDefault();
          mode.onDone();
        } else if (selection) {
          e.preventDefault();
          selection.onClear();
        }
        return;
      }
      if (editable(e.target) || dialogOpen()) return;
      if (e.key === '\\' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // No bar here can fold (a forced presentation, foldable={false}): leave the key alone.
        if (foldables.current.size === 0) return;
        e.preventDefault();
        setPrefsState((cur) => {
          const merged = { ...cur, folded: !cur.folded };
          if (storageKey) {
            try {
              localStorage.setItem(storageKey, JSON.stringify(merged));
            } catch {
              /* storage unavailable */
            }
          }
          return merged;
        });
        return;
      }
      const list = mode ? mode.actions : selection ? selection.actions : idle;
      const hit = list.find((a) => a.shortcut && !a.disabled && !a.disabledReason && matches(a.shortcut, e));
      if (hit) {
        e.preventDefault();
        hit.onSelect();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [storageKey]);

  const value = useMemo(() => ({ version, ...ctxFns, prefs, setPrefs }), [version, ctxFns, prefs, setPrefs]);
  return <ActionBarContext.Provider value={value}>{children}</ActionBarContext.Provider>;
}

function useCtx(): Ctx {
  const ctx = useContext(ActionBarContext);
  if (!ctx) throw new Error('Action bar hooks need an <ActionBarProvider>');
  return ctx;
}

/** Register the page's standing actions (usually 3–5: New, Upload, Select, Comment); withdrawn on unmount. */
export function useActionBarItems(source: string, actions: ActionBarAction[]) {
  const { setItems } = useCtx();
  useLayoutEffect(() => {
    setItems(source, actions);
  });
  useEffect(() => () => setItems(source, null), [setItems, source]);
}

/** Put the bar in the selection state while count > 0; pass null when nothing can be selected. */
export function useActionBarSelection(source: string, selection: ActionBarSelection | null) {
  const { setSelection } = useCtx();
  useLayoutEffect(() => {
    setSelection(source, selection);
  });
  useEffect(() => () => setSelection(source, null), [setSelection, source]);
}

/** Put the bar in a mode (Comment, Translate); null leaves it. */
export function useActionBarMode(source: string, mode: ActionBarMode | null) {
  const { setMode } = useCtx();
  useLayoutEffect(() => {
    setMode(source, mode);
  });
  useEffect(() => () => setMode(source, null), [setMode, source]);
}

/** Hide the bar (signing, presenting, full-screen viewing). Shortcuts keep working. */
export function useActionBarHidden(source: string, hidden: boolean) {
  const { setHidden } = useCtx();
  useLayoutEffect(() => {
    setHidden(source, hidden);
  });
  useEffect(() => () => setHidden(source, false), [setHidden, source]);
}

/** Background work or the Agent running: the folded handle carries a status dot, labelled with this. */
export function useActionBarActivity(source: string, label: string | null) {
  const { setActivity } = useCtx();
  useLayoutEffect(() => {
    setActivity(source, label);
  });
  useEffect(() => () => setActivity(source, null), [setActivity, source]);
}

// ─── Bar ──────────────────────────────────────────────────────────────

function presentationFor(width: number): ActionBarPresentation {
  if (width >= 1280) return 'full';
  if (width >= 1024) return 'labels';
  if (width >= 768) return 'icons';
  return 'folded';
}

function useViewportWidth() {
  const [w, setW] = useState(() => (typeof window === 'undefined' ? 1280 : window.innerWidth));
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return w;
}

type Entry = { kind: 'action'; action: ActionBarAction } | { kind: 'group'; label: string; actions: ActionBarAction[] };

/** Fold groups of more than two, then everything past maxActions into More. */
export function arrange(actions: ActionBarAction[], maxActions: number, moreLabel: string): Entry[] {
  const counts = new Map<string, number>();
  for (const a of actions) if (a.group) counts.set(a.group, (counts.get(a.group) ?? 0) + 1);
  const entries: Entry[] = [];
  const seen = new Set<string>();
  for (const a of actions) {
    if (a.group && (counts.get(a.group) ?? 0) > 2) {
      if (seen.has(a.group)) continue;
      seen.add(a.group);
      entries.push({ kind: 'group', label: a.group, actions: actions.filter((x) => x.group === a.group) });
    } else entries.push({ kind: 'action', action: a });
  }
  if (entries.length <= maxActions) return entries;
  const keep = entries.slice(0, maxActions - 1);
  const rest = entries.slice(maxActions - 1).flatMap((e) => (e.kind === 'action' ? [e.action] : e.actions));
  return [...keep, { kind: 'group', label: moreLabel, actions: rest }];
}

export type ActionBarLabels = {
  /** @default "Actions" */
  bar?: string;
  /** @default "Move" */
  grip?: string;
  /** @default "Fold the action bar" */
  fold?: string;
  /** @default "Show the action bar" */
  unfold?: string;
  /** @default "More" */
  more?: string;
};

export type ActionBarProps = {
  /** Force a presentation (a demo, a narrow host); unset follows the window width and the fold state. */
  presentation?: ActionBarPresentation | undefined;
  /** Hide regardless of pages (e.g. while presenting). Shortcuts keep working. */
  hidden?: boolean | undefined;
  /** Actions per state before the rest fold into More. @default 6 */
  maxActions?: number | undefined;
  labels?: ActionBarLabels | undefined;
  /** Lay it out in place (documentation, a demo) instead of floating: no fixed position, no dragging. */
  inline?: boolean | undefined;
  /** false: always shown in full — no fold button, a stored fold is ignored (a page whose bar is its whole toolbar). @default true */
  foldable?: boolean | undefined;
  className?: string | undefined;
};

const itemCls = cn(
  'inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent px-2.5 font-sans text-ui font-medium text-inherit outline-none',
  'hover:bg-white/10 ink:hover:bg-ink/8 focus-visible:shadow-[0_0_0_2px_var(--yellow-accent)] ink:focus-visible:shadow-[0_0_0_2px_var(--ink)]',
  'disabled:cursor-not-allowed disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:opacity-40',
);

/**
 * ActionBar — the ink strip floating at the bottom centre: the page's most
 * used actions, or the selection's, or a mode's. The highest-contrast
 * element on the page; the brand colour lights only an active item.
 * Narrowing drops shortcuts, then labels, then folds to a handle on the
 * left edge. Drag by the grip; double-click it to reset.
 */
export function ActionBar({ presentation, hidden: hiddenProp, maxActions = 6, labels = {}, inline = false, foldable = true, className }: ActionBarProps) {
  const ctx = useCtx();
  const { idle, selection, mode, hidden, activity } = ctx.read();
  const { prefs, setPrefs } = ctx;
  const width = useViewportWidth();
  const bar = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  const state: ActionBarState = mode ? 'mode' : selection ? 'selection' : 'idle';
  const auto = presentation ?? presentationFor(width);
  // Entering a selection or a mode unfolds it; back in idle the user's fold state returns.
  const folded = foldable && state === 'idle' && (auto === 'folded' || (presentation === undefined && prefs.folded));
  const shown: Exclude<ActionBarPresentation, 'folded'> = auto === 'folded' ? 'icons' : auto;
  // Folding by the user (« and \\) only takes effect when the presentation follows the fold state.
  const canFold = foldable && presentation === undefined;
  const foldId = useId();
  const { setFoldable } = ctx;
  useLayoutEffect(() => {
    setFoldable(foldId, canFold);
    return () => setFoldable(foldId, false);
  }, [setFoldable, foldId, canFold]);

  // Pull the bar back into view when the window shrinks.
  useEffect(() => {
    const el = bar.current;
    if (!el || (prefs.x === 0 && prefs.y === 0)) return;
    const r = el.getBoundingClientRect();
    let { x, y } = prefs;
    if (r.left < 8) x += 8 - r.left;
    if (r.right > window.innerWidth - 8) x -= r.right - (window.innerWidth - 8);
    if (r.top < 8) y += 8 - r.top;
    if (r.bottom > window.innerHeight - 8) y -= r.bottom - (window.innerHeight - 8);
    if (x !== prefs.x || y !== prefs.y) setPrefs({ x, y });
  }, [width, prefs, setPrefs]);

  const list = mode ? mode.actions : selection ? selection.actions : idle;
  if (hiddenProp || hidden || (state === 'idle' && list.length === 0)) return null;

  if (folded) {
    return (
      <button
        type="button"
        onClick={() => setPrefs({ folded: false })}
        aria-label={activity ? `${labels.unfold ?? 'Show the action bar'} · ${activity}` : (labels.unfold ?? 'Show the action bar')}
        title={activity ?? labels.unfold ?? 'Show the action bar'}
        className={cn(
          inline ? 'relative' : 'fixed bottom-6 left-0 z-40',
          'inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-r-lg border-0 bg-ink pr-2.5 pl-2 text-linen outline-none',
          'hover:bg-ink-raised focus-visible:shadow-(--focus-ring) ink:bg-linen ink:text-ink',
          className,
        )}
      >
        <ChevronsRight size={16} aria-hidden />
        {activity && <span aria-hidden className="size-2 rounded-pill bg-brand-mark motion-safe:animate-pulse" />}
      </button>
    );
  }

  const entries = arrange(list, maxActions, labels.more ?? 'More');

  const onToolbarKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
    const buttons = Array.from(bar.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') ?? []);
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    e.preventDefault();
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next]?.focus();
  };

  const renderAction = (a: ActionBarAction) => {
    const keys = a.shortcut ? formatShortcut(a.shortcut) : null;
    const Glyph = a.icon;
    const iconOnly = (shown === 'icons' || a.iconOnly) && Glyph;
    const plain = (
      <button
        type="button"
        aria-label={iconOnly ? a.label : undefined}
        aria-pressed={a.active === undefined ? undefined : a.active}
        aria-keyshortcuts={a.shortcut ? keys ?? undefined : undefined}
        disabled={a.disabled && !a.disabledReason ? true : undefined}
        aria-disabled={a.disabledReason ? true : undefined}
        onClick={() => !a.disabledReason && a.onSelect()}
        className={cn(itemCls, a.active && 'bg-brand-field text-ink hover:bg-brand-field ink:hover:bg-brand-field')}
      >
        {Glyph && <Glyph size={16} strokeWidth={1.75} aria-hidden />}
        {!iconOnly && <span>{a.label}</span>}
        {shown === 'full' && keys && !iconOnly && <kbd className="font-sans text-meta font-medium opacity-55">{keys}</kbd>}
      </button>
    );
    const button = a.wrap ? a.wrap(plain) : plain;
    const rule = a.divider ? <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-white/20 ink:bg-ink/20" /> : null;
    const hint = a.disabledReason ?? (shown !== 'full' || iconOnly ? [a.label, keys].filter(Boolean).join(' · ') : null);
    const tipped = hint && (iconOnly || a.disabledReason || keys) ? <Tooltip content={hint}>{button}</Tooltip> : button;
    return (
      <Fragment key={a.id}>
        {rule}
        {tipped}
      </Fragment>
    );
  };

  return (
    <div
      ref={bar}
      role="toolbar"
      aria-label={labels.bar ?? 'Actions'}
      onKeyDown={onToolbarKey}
      data-state={state}
      data-presentation={shown}
      style={inline ? undefined : { transform: `translate(calc(-50% + ${prefs.x}px), ${prefs.y}px)` }}
      className={cn(
        'flex max-w-[calc(100vw-16px)] items-center gap-0.5 overflow-x-auto rounded-lg bg-ink p-1.5 font-sans text-linen',
        'ink:bg-linen ink:text-ink',
        inline
          ? 'relative w-fit'
          : 'fixed bottom-6 left-1/2 z-40 max-md:bottom-0 max-md:left-0 max-md:w-full max-md:max-w-none max-md:translate-x-0! max-md:rounded-none',
        className,
      )}
    >
      {/* An inline bar sits in the page: nothing to drag. */}
      {!inline && (
        <span
          aria-hidden
          title={labels.grip ?? 'Move'}
          onPointerDown={(e) => {
            (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
            drag.current = { px: e.clientX, py: e.clientY, x: prefs.x, y: prefs.y };
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d || !bar.current) return;
            bar.current.style.transform = `translate(calc(-50% + ${d.x + e.clientX - d.px}px), ${d.y + e.clientY - d.py}px)`;
          }}
          onPointerUp={(e) => {
            const d = drag.current;
            drag.current = null;
            if (!d) return;
            const x = d.x + e.clientX - d.px;
            const y = d.y + e.clientY - d.py;
            // Dragged to the left edge: fold.
            if (e.clientX < 24) setPrefs({ folded: true, x: 0, y: 0 });
            else setPrefs({ x, y });
          }}
          onDoubleClick={() => setPrefs({ x: 0, y: 0 })}
          className="grid h-9 w-5 shrink-0 cursor-grab touch-none place-items-center opacity-50 hover:opacity-100 max-md:hidden"
        >
          <GripVertical size={14} />
        </span>
      )}

      {selection && !mode && (
        <span aria-live="polite" className="px-2.5 text-ui font-medium whitespace-nowrap">
          {selection.countLabel ? selection.countLabel(selection.count) : `${selection.count} selected`}
        </span>
      )}
      {/* The mode is named, not badged: the brand colour lights only an active item. */}
      {mode && <span className="px-2.5 text-ui font-semibold whitespace-nowrap">{mode.name}</span>}

      {entries.map((entry) =>
        entry.kind === 'action' ? (
          renderAction(entry.action)
        ) : (
          <Menu key={`g:${entry.label}`}>
            <MenuTrigger asChild>
              <button type="button" className={itemCls}>
                <span>{entry.label}</span>
                <ChevronDown size={14} aria-hidden />
              </button>
            </MenuTrigger>
            <MenuContent side="top">
              {entry.actions.map((a) => (
                <MenuItem
                  key={a.id}
                  icon={a.icon ? <a.icon size={16} strokeWidth={1.75} aria-hidden /> : undefined}
                  shortcut={a.shortcut ? formatShortcut(a.shortcut) : undefined}
                  disabled={Boolean(a.disabled)}
                  disabledReason={a.disabledReason}
                  onSelect={() => a.onSelect()}
                >
                  {a.label}
                </MenuItem>
              ))}
            </MenuContent>
          </Menu>
        ),
      )}

      {selection && !mode && (
        <>
          <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-white/20 ink:bg-ink/20" />
          <button type="button" onClick={selection.onClear} className={itemCls}>
            <X size={16} aria-hidden />
            <span>{selection.clearLabel ?? 'Cancel'}</span>
            {shown === 'full' && <kbd className="font-sans text-meta font-medium opacity-55">Esc</kbd>}
          </button>
        </>
      )}
      {mode && (
        <>
          <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-white/20 ink:bg-ink/20" />
          <button type="button" onClick={mode.onDone} className={cn(itemCls, 'font-semibold')}>
            {mode.doneLabel ?? 'Done'}
            {shown === 'full' && <kbd className="font-sans text-meta font-medium opacity-55">Esc</kbd>}
          </button>
        </>
      )}
      {state === 'idle' && canFold && (
        <Tooltip content={`${labels.fold ?? 'Fold the action bar'} · \\`}>
          <button type="button" aria-label={labels.fold ?? 'Fold the action bar'} onClick={() => setPrefs({ folded: true })} className={cn(itemCls, 'px-2 opacity-60 hover:opacity-100 max-md:hidden')}>
            <ChevronsLeft size={16} aria-hidden />
          </button>
        </Tooltip>
      )}
    </div>
  );
}
