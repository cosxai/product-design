import type { ReactNode } from "react";

// Section break with a Roman-numeral marker. "I.", "II.", ...
// in oversized serif italic, followed by a thin hairline rule.
// Use to delimit major content slabs inside an editorial page.

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

export interface RomanSectionProps {
  // 1-indexed numeral. Anything above XII falls back to the
  // arabic numeral so we don't have to ship a full converter.
  n: number;
  title: ReactNode;
  // Optional eyebrow (rendered above the numeral).
  eyebrow?: string;
}

export function RomanSection({ n, title, eyebrow }: RomanSectionProps) {
  const numeral = n >= 1 && n <= ROMAN.length ? ROMAN[n - 1] : String(n);
  return (
    <section style={{ margin: "56px 0 32px" }}>
      {eyebrow && (
        <div
          style={{
            font: "500 10px/1 var(--ck-font-sans)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ck-text-tertiary)",
            marginBottom: 8,
          }}
        >
          — {eyebrow}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 12 }}>
        <span
          style={{
            font: "500 italic 64px/1 var(--ck-font-serif)",
            color: "var(--ck-text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          {numeral}.
        </span>
        <h2
          style={{
            font: "500 28px/1.1 var(--ck-font-display)",
            color: "var(--ck-text-primary)",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
      </div>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--ck-text-primary)",
          margin: 0,
        }}
      />
    </section>
  );
}
