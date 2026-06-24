import { useEffect, type ReactNode, type CSSProperties } from "react";
import { createPortal } from "react-dom";

// Modal base. Portals to document.body so it escapes ancestor
// stacking contexts. Closes on Esc + backdrop click (both opt-out).
// Caller owns open state and slots in the header/body/footer.
//
// Provides three sub-components for compositional layout:
//   - <Modal>          — the host (backdrop + card + close binding)
//   - <ModalHeader>    — sticky-ish top with title + optional close X
//   - <ModalBody>      — scrollable middle region
//   - <ModalFooter>    — sticky-ish bottom (buttons)

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  // Disables close on backdrop click + Escape. Useful for blocking
  // dialogs that must be resolved via an explicit button.
  dismissable?: boolean;
  // Width preset OR raw px. Default "md" (440 px).
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | number;
  // Inline style override for the card.
  cardStyle?: CSSProperties;
  children: ReactNode;
  // Optional aria-labelled-by for screen readers (point at the
  // ModalHeader title's id).
  labelledBy?: string;
}

const WIDTHS = { sm: 340, md: 440, lg: 560, xl: 720, "2xl": 880, "3xl": 1024, "4xl": 1200, "5xl": 1440 };

export function Modal({
  open,
  onClose,
  dismissable = true,
  maxWidth = "md",
  cardStyle,
  children,
  labelledBy,
}: ModalProps) {
  useEffect(() => {
    if (!open || !dismissable) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismissable, onClose]);

  // Lock body scroll while open so the backdrop doesn't reveal
  // a scrolling page underneath.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;
  const width = typeof maxWidth === "number" ? maxWidth : WIDTHS[maxWidth];
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 14, 26, 0.6)",
        // Pull the page surface noticeably out of focus behind the
        // modal — agent-dataroom's `backdrop-blur-sm` (4px) reads as
        // a hint; 8px reads as a clear "the world stopped". The card
        // sits above the blurred layer, so the content stays crisp.
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 100,
      }}
      onMouseDown={(e) => {
        // Backdrop click closes; clicks inside the card stopPropagation.
        if (dismissable && e.target === e.currentTarget) onClose();
      }}
      className="ck-anim-fade"
    >
      <div
        style={{
          width: "100%",
          maxWidth: width,
          maxHeight: "calc(100vh - 32px)",
          background: "var(--ck-bg-surface)",
          border: "1px solid var(--ck-border-subtle)",
          // Modal cards lift on the `-lg` radius rather than the
          // page's default `-md` so the corners read as softer than
          // the cards underneath them — supports the "this took
          // over" cue alongside the deeper overlay shadow.
          borderRadius: "var(--ck-radius-lg)",
          // Overlay shadow > shadow-3. shadow-3 was tuned for cards
          // sitting on a page; a modal needs to read as physically
          // lifted off the page, not as another tier of card.
          boxShadow: "var(--ck-shadow-overlay)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "var(--ck-font-sans)",
          color: "var(--ck-text-primary)",
          ...cardStyle,
        }}
        className="ck-anim-popover"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

// ---------- Slot components ----------

export interface ModalHeaderProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  onClose?: () => void;
  titleId?: string;
}

export function ModalHeader({ title, subtitle, onClose, titleId }: ModalHeaderProps) {
  if (!title && !subtitle && !onClose) return null;
  return (
    <header
      style={{
        // Editorial-modal breathing room: matches the 24-px gutter
        // ModalBody / ModalFooter ship so a Modal renders as one
        // coherent column of 24-px insets rather than three slots
        // with different paddings.
        padding: "20px 24px",
        borderBottom: "1px solid var(--ck-border-subtle)",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <h2
            id={titleId}
            style={{
              font: "500 16px/1.3 var(--ck-font-sans)",
              margin: 0,
              color: "var(--ck-text-primary)",
            }}
          >
            {title}
          </h2>
        )}
        {subtitle && (
          <p
            style={{
              font: "400 12px/1.4 var(--ck-font-sans)",
              color: "var(--ck-text-tertiary)",
              margin: "4px 0 0",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--ck-bg-muted)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
          }}
          style={{
            border: "none",
            background: "transparent",
            color: "var(--ck-text-tertiary)",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            padding: 4,
            borderRadius: "var(--ck-radius-sm, 4px)",
            transition:
              "background var(--ck-dur-fast) var(--ck-ease)",
          }}
        >
          ×
        </button>
      )}
    </header>
  );
}

export function ModalBody({ children }: { children: ReactNode }) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px 24px 24px" }}>
      {children}
    </div>
  );
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <footer
      style={{
        padding: "16px 24px",
        borderTop: "1px solid var(--ck-border-subtle)",
        display: "flex",
        justifyContent: "flex-end",
        gap: 8,
        background: "var(--ck-bg-surface-2)",
      }}
    >
      {children}
    </footer>
  );
}
