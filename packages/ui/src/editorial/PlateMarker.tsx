// "N° 01" / "N° 02" plate numbering — sits in the top-left of
// editorial cards and stat blocks. Uses small caps for the prefix
// and a tabular numeral so a column of plates aligns visually.

export interface PlateMarkerProps {
  // The numeral, 1-indexed. Zero-padded to 2 digits ("01").
  n: number;
  // "N°" by default. Override to "Plate", "Vol.", "Issue", etc.
  prefix?: string;
  className?: string;
}

export function PlateMarker({ n, prefix = "N°", className }: PlateMarkerProps) {
  const padded = n < 10 ? `0${n}` : String(n);
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 4,
        font: "500 10px/1 var(--ck-font-sans)",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--ck-text-tertiary)",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span style={{ fontStyle: "italic" }}>{prefix}</span>
      <span style={{ color: "var(--ck-text-primary)" }}>{padded}</span>
    </span>
  );
}
