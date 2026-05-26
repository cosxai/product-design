import { useState, type CSSProperties, type FormEvent } from "react";

// The signature ambient component — floating AI / command pill
// at the bottom of the main content. Heavily blurred glass
// backdrop, gradient avatar on the left (signals "AI / live"),
// and a thin Superbar gradient line above it that doubles as a
// section divider. The most distinctive moment in the design
// language.
//
// Works under any chrome — only really "reads" under
// ambient because the glass + Superbar accent are the defining
// gestures. Under other chromes the pill is just a styled
// input + divider.

export interface CommandInputProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
  // Width cap on the pill itself. Default 520 px (Superlist-ish).
  maxWidth?: number;
  // Hide the Superbar divider above. Default false.
  hideDivider?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function CommandInput({
  placeholder = "Ask anything…",
  onSubmit,
  maxWidth = 520,
  hideDivider = false,
  className,
  style,
}: CommandInputProps) {
  const [value, setValue] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit?.(value.trim());
    setValue("");
  };

  return (
    <div className={className} style={{ width: "100%", ...style }}>
      {!hideDivider && (
        <div
          aria-hidden
          style={{
            height: 1,
            background: "var(--ck-superbar)",
            opacity: 0.7,
            margin: "0 auto 20px",
            maxWidth,
          }}
        />
      )}
      <form
        onSubmit={submit}
        style={{
          maxWidth,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          background: "var(--ck-bg-sidebar, rgba(20,20,28,0.55))",
          border: "1px solid var(--ck-border-subtle, rgba(255,255,255,0.08))",
          borderRadius: 999,
          backdropFilter: "var(--ck-blur-overlay, blur(40px) saturate(180%))",
          WebkitBackdropFilter: "var(--ck-blur-overlay, blur(40px) saturate(180%))",
          boxShadow: "var(--ck-shadow-2)",
        }}
      >
        {/* Gradient avatar — coral → violet → blue. Marks the
            pill as "AI / live", regardless of the consumer's
            brand accent. */}
        <span
          aria-hidden
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "var(--ck-superbar)",
            flexShrink: 0,
            boxShadow: "0 0 12px color-mix(in srgb, #B66EFF 40%, transparent)",
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            minWidth: 0,
            height: 32,
            padding: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            color: "var(--ck-text-primary)",
            font: "400 14px/1 var(--ck-font-sans)",
          }}
        />
      </form>
    </div>
  );
}
