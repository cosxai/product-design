import { cn } from "../lib/cn";

// Circular avatar — image with initials fallback. Use the `name`
// prop to derive initials (first letter of first two whitespace-
// separated tokens). Size scales the whole thing including font.

export interface AvatarProps {
  // Display name — used for initials fallback and as alt text.
  name: string;
  // Image src. If omitted or fails to load, falls back to initials.
  src?: string | null;
  size?: number; // px, default 32
  className?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export function Avatar({ name, src, size = 32, className }: AvatarProps) {
  return (
    <span
      className={cn("ck-avatar", className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--ck-bg-muted)",
        color: "var(--ck-text-secondary)",
        font: `500 ${Math.round(size * 0.4)}px/1 var(--ck-font-sans)`,
        overflow: "hidden",
        flexShrink: 0,
      }}
      aria-label={name}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}
