import { Fragment, type ReactNode } from "react";

// Crumb item — either a label (terminal node, no link) or a label
// with a click handler. The kit doesn't ship router integration —
// consumers pass plain onClick or wrap children in their own router's
// link primitive (e.g. <NavLink to={...}>{label}</NavLink>).

export interface CrumbItem {
  label: string;
  onClick?: () => void;
  // Custom render — escape hatch for "wrap this crumb in <Link>".
  // When set, label/onClick are ignored.
  render?: ReactNode;
}

export interface BreadcrumbProps {
  items: ReadonlyArray<string | CrumbItem>;
  // Slot to the right of the last crumb (e.g. doc-meta popover trigger).
  accessory?: ReactNode;
  className?: string;
}

function normalise(item: string | CrumbItem): CrumbItem {
  return typeof item === "string" ? { label: item } : item;
}

// Phase-2 breadcrumb: simple chain with separator dots. The full
// middle-collapse + narrow-viewport popover fallback from deck-kit
// is deferred to a later iteration once the kit's surface stabilises.
// For now, long chains wrap; consumers should avoid >4 crumbs.
export function Breadcrumb({ items, accessory, className }: BreadcrumbProps) {
  const list = items.map(normalise);
  return (
    <nav
      aria-label="Breadcrumb"
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        font: "400 12px/1 var(--ck-font-mono)",
        color: "var(--ck-text-tertiary)",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        minWidth: 0,
        flex: "1 1 auto",
      }}
    >
      {list.map((crumb, i) => {
        const isLast = i === list.length - 1;
        return (
          <Fragment key={i}>
            {i > 0 && (
              <span aria-hidden style={{ color: "var(--ck-text-disabled)" }}>·</span>
            )}
            <span
              style={{
                color: isLast ? "var(--ck-text-primary)" : "var(--ck-text-tertiary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: crumb.onClick ? "pointer" : "default",
              }}
              onClick={crumb.onClick}
            >
              {crumb.render ?? crumb.label}
            </span>
          </Fragment>
        );
      })}
      {accessory && <span style={{ marginLeft: 4 }}>{accessory}</span>}
    </nav>
  );
}
