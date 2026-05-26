import { useEffect, useRef, type ReactNode } from "react";
import { ActionBarButton } from "./ActionBarButton";
import type { ActionBarItem } from "./types";

// Inline-expandable group inside the action bar. Head button +
// disclosure region of child items. When open:
//   - head gets a "soft" foreground (or "primary" if a child is
//     active), wrapped in a muted-accent pill that extends across
//     the children too
//   - children animate in via max-width + opacity transition
//     (no mount/unmount so the open/close has motion)
//   - ESC + outside-click both close

export interface ActionBarMenuGroupProps {
  label: string;
  icon?: ReactNode;
  hasActiveChild: boolean;
  isOpen: boolean;
  onToggle: () => void;
  items: ActionBarItem[];
  onItemClicked: (item: ActionBarItem) => void;
}

export function ActionBarMenuGroup({
  label,
  icon,
  hasActiveChild,
  isOpen,
  onToggle,
  items,
  onItemClicked,
}: ActionBarMenuGroupProps) {
  const headVariant: "ghost" | "primary" | "soft" = hasActiveChild
    ? "primary"
    : isOpen
      ? "soft"
      : "ghost";

  // Outside-click closes the group via a capture-phase listener so
  // the menu dismisses before the click reaches any other handler.
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(e.target as Node)) return;
      onToggle();
    };
    document.addEventListener("mousedown", onMouseDown, true);
    return () => document.removeEventListener("mousedown", onMouseDown, true);
  }, [isOpen, onToggle]);

  return (
    <div
      ref={wrapperRef}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: isOpen ? "var(--ck-accent-muted)" : "transparent",
        borderRadius: 999,
        transition: "background 200ms ease",
      }}
    >
      <ActionBarButton
        icon={icon}
        label={label}
        title={isOpen ? `Close ${label}` : label}
        variant={headVariant}
        chevron="right"
        chevronRotated={isOpen}
        onClick={onToggle}
      />
      <div
        aria-hidden={!isOpen}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          overflow: "hidden",
          maxWidth: isOpen ? 1000 : 0,
          opacity: isOpen ? 1 : 0,
          marginLeft: isOpen ? 0 : -6,
          paddingRight: isOpen ? 4 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition:
            "max-width 240ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms ease, margin-left 240ms cubic-bezier(0.4, 0, 0.2, 1), padding-right 240ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {items.map((it) => (
          <ActionBarButton
            key={it.key}
            icon={it.icon}
            label={it.label}
            title={it.title}
            active={it.active}
            disabled={it.disabled || !isOpen}
            variant={it.variant}
            hint={it.hint}
            onClick={() => onItemClicked(it)}
          />
        ))}
      </div>
    </div>
  );
}
