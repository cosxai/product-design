import type { ReactNode, CSSProperties } from "react";

// Standard list-page header — eyebrow + title + optional
// description + right-aligned action cluster. Wrap the top of
// list / overview pages so visual rhythm stays consistent across
// the app.

export interface PageHeaderProps {
  // Small uppercase mono cap above the title — "ACCESS · SHARES".
  eyebrow?: string;
  // Main heading (typically a sentence: "Bundles you've sent.").
  title: ReactNode;
  // Optional one-or-two-line caption under the title.
  description?: ReactNode;
  // Right-aligned cluster of buttons / chips / status items.
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  style,
}: PageHeaderProps) {
  return (
    <header
      className={className}
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 16,
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "1px solid var(--ck-border-subtle)",
        fontFamily: "var(--ck-font-sans)",
        ...style,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && (
          <div className="ck-eyebrow" style={{ marginBottom: 6 }}>
            {eyebrow}
          </div>
        )}
        <h1
          style={{
            font: "500 22px/1.3 var(--ck-font-sans)",
            letterSpacing: "-0.005em",
            color: "var(--ck-text-primary)",
            margin: 0,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              font: "400 13px/1.55 var(--ck-font-sans)",
              color: "var(--ck-text-tertiary)",
              margin: "6px 0 0",
              maxWidth: "44rem",
            }}
          >
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: "flex", gap: 8, flex: "none" }}>{actions}</div>
      )}
    </header>
  );
}
