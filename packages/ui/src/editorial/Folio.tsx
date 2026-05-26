import type { ReactNode } from "react";

// Folio bar — thin hairline rule above a row of editorial
// metadata. Sits at the top of every section in the editorial
// chrome ("SECTION TITLE · CROSSREF · PLATE 0X" on the left,
// "00X / 008" page number on the right).
//
// Renders fine under any chrome but only feels "right" under
// editorial — the hairline + tracked metadata pair are the
// editorial language, neutral in other chromes.

export interface FolioProps {
  // Left-aligned metadata fragments. Joined with the editorial
  // separator (" · ").
  left: (string | ReactNode)[];
  // Right-aligned fragment (typically the page number).
  right?: string | ReactNode;
  className?: string;
}

export function Folio({ left, right, className }: FolioProps) {
  return (
    <header
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderTop: "1px solid var(--ck-text-primary)",
        borderBottom: "1px solid var(--ck-text-primary)",
        margin: "0 0 24px",
        font: "500 10px/1.2 var(--ck-font-sans)",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--ck-text-primary)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexWrap: "wrap", gap: "0 8px" }}>
        {left.map((seg, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {i > 0 && <span style={{ color: "var(--ck-text-tertiary)" }}>·</span>}
            <span>{seg}</span>
          </span>
        ))}
      </div>
      {right && (
        <div style={{ flex: "none", color: "var(--ck-text-secondary)" }}>{right}</div>
      )}
    </header>
  );
}
