import { Kbd } from "../primitives/Kbd";

// Search-style command-palette opener for the left rail. Wide
// click target, search icon on the left, kbd hint on the right.
// Hidden in collapsed mode — the palette is still reachable via
// ⌘K, no need for a dedicated trigger when there's no label space.

export interface NavSearchTriggerProps {
  onClick: () => void;
  placeholder?: string;
  hotkey?: string;
  collapsed?: boolean;
}

export function NavSearchTrigger({
  onClick,
  placeholder = "Search",
  hotkey = "K",
  collapsed,
}: NavSearchTriggerProps) {
  if (collapsed) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open command palette"
      title="Open command palette"
      data-ck-search-trigger
      style={{
        position: "relative",
        width: "100%",
        height: 34,
        padding: "0 8px 0 32px",
        background: "var(--ck-bg-muted)",
        border: "1px solid transparent",
        borderRadius: "var(--ck-radius-sm)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        textAlign: "left",
        transition: "background var(--ck-dur-fast) var(--ck-ease), border-color var(--ck-dur-fast) var(--ck-ease)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--ck-border-strong)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "transparent";
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--ck-text-tertiary)",
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <span
        style={{
          flex: 1,
          font: "400 12px/1 var(--ck-font-sans)",
          color: "var(--ck-text-tertiary)",
        }}
      >
        {placeholder}
      </span>
      <span style={{ display: "inline-flex", gap: 2 }}>
        <Kbd>Mod</Kbd>
        <Kbd>{hotkey}</Kbd>
      </span>
    </button>
  );
}
