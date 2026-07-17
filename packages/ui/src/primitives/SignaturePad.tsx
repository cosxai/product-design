import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

/**
 * SignaturePad — legally-binding e-signature capture.
 *
 * Two modes:
 *   - `typed`  — signer types their name; canvas paints it in the
 *                Caveat cursive script + emits PNG dataURL.
 *   - `drawn`  — signer draws with mouse / trackpad / touch; captured
 *                as a smoothed stroke path + rasterised to PNG.
 *
 * Both modes produce the same output shape: `image/png` dataURL via
 * `canvas.toDataURL('image/png')`. Downstream consumer (metaroom
 * SignDocumentPage) uploads that dataURL to mesh's signing endpoint;
 * mesh stores as `signature_png` on the signing session + bakes into
 * the certified PDF client-side.
 *
 * Compose with:
 *   - SigningCommitBar (footer state machine that owns the submit
 *     transition — SignaturePad is presentation only)
 *   - FieldWalker (DOM sequencer that focuses this pad when the
 *     current field is a signature block)
 *
 * Visual: see docs/components/signature-pad.
 *
 * Design decisions:
 *   - Controlled component. Parent owns `value` + `onChange`. This
 *     lets SigningCommitBar preserve captured state across phase
 *     transitions (fill → consent → review → back to fill).
 *   - `mode` toggle is controlled by parent too — no built-in tabs.
 *     Callers usually render a small pill switcher above the pad.
 *   - Font loading uses `document.fonts.ready` before rendering typed
 *     mode. Without the await, the first typed capture paints in the
 *     browser fallback (usually Brush Script or serif italic).
 *   - Drawn mode uses `touch-action: none` + `pointerdown`
 *     preventDefault to stop iOS Safari from scrolling instead of
 *     drawing.
 *   - `imperativeHandle` exposes `clear()` for the parent's Undo
 *     button.
 */
export interface SignaturePadProps {
  /** Capture mode. Parent owns the toggle. */
  mode: "typed" | "drawn";
  /**
   * Current captured PNG dataURL, or null when nothing captured.
   * Controlled by the parent so state survives the parent's phase
   * transitions.
   */
  value: string | null;
  /**
   * Fires whenever the pad captures a new dataURL (typed input
   * changed, drawn stroke completed, cleared). null on clear.
   */
  onChange: (dataURL: string | null) => void;
  /**
   * Typed-mode input. Parent may bind this to the signer's display
   * name for a stable signature. Ignored in drawn mode.
   */
  typedName?: string;
  /**
   * Typed-mode text change — fires ONLY in typed mode, on every
   * keystroke. Parent updates its state; the pad reruns the typed
   * bake on the next paint. Ignored in drawn mode.
   */
  onTypedNameChange?: (next: string) => void;
  /** Canvas pixel width. Defaults to 480. */
  width?: number;
  /** Canvas pixel height. Defaults to 120. */
  height?: number;
  /**
   * Font family used in typed mode. Defaults to `"Caveat", "Segoe
   * Script", cursive` — Caveat is the most common signature font
   * available across the Google Fonts CDN + Adobe Fonts.
   */
  typedFontFamily?: string;
  /** Stroke color in drawn mode. Defaults to `#0b1220` (near-black). */
  strokeColor?: string;
  /** Stroke width in drawn mode. Defaults to 2. */
  strokeWidth?: number;
  /**
   * Consumer-set className on the outer wrapper. Component ships its
   * own inline styles; className is for layout only (grid parent
   * spacing etc).
   */
  className?: string;
}

/** Imperative handle for parent-side controls (Undo, Clear buttons). */
export interface SignaturePadHandle {
  /** Wipe the canvas + emit null via onChange. */
  clear: () => void;
}

const DEFAULT_WIDTH = 480;
const DEFAULT_HEIGHT = 120;
const DEFAULT_TYPED_FONT = '"Caveat", "Segoe Script", cursive';

export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(
  function SignaturePad(
    {
      mode,
      value,
      onChange,
      typedName = "",
      onTypedNameChange,
      width = DEFAULT_WIDTH,
      height = DEFAULT_HEIGHT,
      typedFontFamily = DEFAULT_TYPED_FONT,
      strokeColor = "#0b1220",
      strokeWidth = 2,
      className,
    }: SignaturePadProps,
    ref,
  ): ReactNode {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // Track whether the currently-painted canvas is "dirty" (has
    // strokes / typed pixels) so clear() knows whether to emit null.
    const dirtyRef = useRef<boolean>(value !== null);

    // Drawn mode point buffer — used for smoothed line via quadratic
    // interpolation. Reset on stroke end.
    const drawStateRef = useRef<{
      drawing: boolean;
      lastX: number;
      lastY: number;
    }>({ drawing: false, lastX: 0, lastY: 0 });

    // Font-load await for typed mode. Setting to `true` triggers a
    // re-render + re-paint of the current typedName. First mount in
    // typed mode WITHOUT this await paints in the browser fallback
    // font — Ben's spec called this out as a bug we must not ship.
    const [fontReady, setFontReady] = useState<boolean>(() => {
      if (typeof document === "undefined") return true;
      // Best-effort: document.fonts may be absent in older browsers.
      // Fall through as ready so we don't block the pad forever.
      const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
      return !fonts;
    });
    useEffect(() => {
      if (fontReady) return;
      if (typeof document === "undefined") return;
      const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
      if (!fonts) {
        setFontReady(true);
        return;
      }
      let cancelled = false;
      // Actively REQUEST the typed font. @font-face registration
      // (fontsource CSS etc.) doesn't fetch the file until some
      // rendered text uses it — and this component's only consumer
      // of the font is the canvas, whose fillText silently falls
      // back to the next family when the face isn't loaded yet.
      // fonts.load() forces the fetch; fonts.ready is the safety
      // net for browsers without it / faces not registered.
      const kick =
        typeof fonts.load === "function"
          ? fonts.load(`32px ${typedFontFamily}`).catch(() => [])
          : Promise.resolve([]);
      void kick
        .then(() => fonts.ready)
        .then(() => {
          if (cancelled) return;
          setFontReady(true);
        });
      return () => {
        cancelled = true;
      };
      // typedFontFamily is config-stable per consumer; re-kicking on
      // change is correct anyway.
    }, [fontReady, typedFontFamily]);

    // Mode switch — clear the canvas so a stale typed baseline
    // doesn't hang around behind a drawn signature (or vice versa).
    // MUST be declared BEFORE the typed-repaint + drawn-restore
    // effects: effects run in declaration order, and v0.13.0 had
    // this clear declared LAST — on switching to typed mode with a
    // prefilled name the repaint painted first and this then wiped
    // it (QA 2026-07-17: Type tab showed an empty pad until the
    // signer edited the name). Skips the mount run so a parent-held
    // captured value isn't nulled on first render.
    const prevModeRef = useRef(mode);
    useEffect(() => {
      if (prevModeRef.current === mode) return;
      prevModeRef.current = mode;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dirtyRef.current = false;
      onChange(null);
      // Only fire when mode itself changes.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    // Repaint on typedName / mode / fontReady change. Drawn mode
    // doesn't repaint imperatively — strokes are appended as the user
    // draws.
    useEffect(() => {
      if (mode !== "typed") return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!typedName.trim()) {
        dirtyRef.current = false;
        onChange(null);
        return;
      }
      if (!fontReady) return;
      // Paint the name centred vertically, left-aligned horizontally.
      // Auto-fit font size to width: start at height * 0.6 and shrink
      // until measureText fits within `width - 24` (12px padding each
      // side).
      let fontSize = Math.round(height * 0.7);
      ctx.textBaseline = "middle";
      ctx.fillStyle = strokeColor;
      const availableWidth = width - 24;
      while (fontSize > 10) {
        ctx.font = `${fontSize}px ${typedFontFamily}`;
        if (ctx.measureText(typedName).width <= availableWidth) break;
        fontSize -= 2;
      }
      ctx.fillText(typedName, 12, height / 2);
      const dataURL = canvas.toDataURL("image/png");
      dirtyRef.current = true;
      onChange(dataURL);
      // onChange is stable-by-contract from parent (React best
      // practice); avoid feeding it into deps to prevent infinite
      // loop.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      mode,
      typedName,
      fontReady,
      width,
      height,
      typedFontFamily,
      strokeColor,
    ]);

    // Restore a previously-captured value into the canvas on MOUNT
    // only (parent phase round-trips remount the pad). Typed mode
    // uses the repaint effect above; drawn mode needs to explicitly
    // paint the dataURL back so subsequent strokes continue on top.
    //
    // Deliberately NOT re-run on mode switch: the clear effect wipes
    // the canvas on switch, and re-painting the old capture here
    // resurrected the TYPED baseline inside the drawn pad (v0.13.2
    // regression — switching Type → Draw showed the handwriting-font
    // bake as if it had been drawn).
    const didRestoreRef = useRef(false);
    useEffect(() => {
      if (didRestoreRef.current) return;
      didRestoreRef.current = true;
      if (mode !== "drawn" || !value) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        dirtyRef.current = true;
      };
      img.src = value;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = useCallback(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      dirtyRef.current = false;
      onChange(null);
      if (mode === "typed") {
        onTypedNameChange?.("");
      }
    }, [mode, onChange, onTypedNameChange]);

    useImperativeHandle(ref, () => ({ clear }), [clear]);

    // Drawn mode — pointer event handlers.
    const onPointerDown = useCallback(
      (e: ReactPointerEvent<HTMLCanvasElement>) => {
        if (mode !== "drawn") return;
        // touch-action: none on the canvas isn't enough on iOS
        // Safari — need preventDefault too, otherwise the browser
        // scrolls the page instead of drawing.
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        // Coordinate space: pointer client coords → canvas backing
        // store coords. `rect` is CSS pixels; canvas.width is device
        // pixels (or logical pixels when no DPR handling). Scale so
        // strokes land at the visual point.
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        drawStateRef.current.drawing = true;
        drawStateRef.current.lastX = x;
        drawStateRef.current.lastY = y;
        canvas.setPointerCapture(e.pointerId);
      },
      [mode],
    );

    const onPointerMove = useCallback(
      (e: ReactPointerEvent<HTMLCanvasElement>) => {
        if (mode !== "drawn") return;
        if (!drawStateRef.current.drawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(drawStateRef.current.lastX, drawStateRef.current.lastY);
        // Simple line-to; a smoother quadratic curve is possible via
        // buffering the last N points, but the default line-to
        // already reads well at 2px stroke on human-scale pads.
        ctx.lineTo(x, y);
        ctx.stroke();
        drawStateRef.current.lastX = x;
        drawStateRef.current.lastY = y;
        dirtyRef.current = true;
      },
      [mode, strokeColor, strokeWidth],
    );

    const onPointerUp = useCallback(
      (e: ReactPointerEvent<HTMLCanvasElement>) => {
        if (mode !== "drawn") return;
        drawStateRef.current.drawing = false;
        const canvas = canvasRef.current;
        if (!canvas) return;
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch {
          // Some browsers throw when the pointer isn't captured
          // (spurious pointerup); safe to ignore.
        }
        if (!dirtyRef.current) return;
        const dataURL = canvas.toDataURL("image/png");
        onChange(dataURL);
      },
      [mode, onChange],
    );

    // Wrapper + canvas styles. Inline (following the ck-* CSS var
    // conventions) so consumers get a functional pad without needing
    // to import a CSS file.
    const wrapStyle: CSSProperties = useMemo(
      () => ({
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "fit-content",
      }),
      [],
    );
    const canvasStyle: CSSProperties = useMemo(
      () => ({
        width,
        height,
        border: "1px solid var(--ck-border-subtle, #d4d4d8)",
        borderRadius: "var(--ck-radius-sm, 6px)",
        background: "var(--ck-bg-surface, #ffffff)",
        // touch-action: none is the load-bearing bit for iOS Safari
        // drawn mode — otherwise the page scrolls instead of drawing.
        touchAction: "none",
        cursor: mode === "drawn" ? "crosshair" : "default",
        display: "block",
      }),
      [mode, width, height],
    );
    const typedInputStyle: CSSProperties = useMemo(
      () => ({
        padding: "6px 8px",
        border: "1px solid var(--ck-border-subtle, #d4d4d8)",
        borderRadius: "var(--ck-radius-sm, 6px)",
        background: "var(--ck-bg-surface, #ffffff)",
        color: "var(--ck-text-primary, #0b1220)",
        fontSize: 14,
        fontFamily: "inherit",
        width,
      }),
      [width],
    );

    return (
      <div className={className} style={wrapStyle}>
        {mode === "typed" ? (
          <input
            type="text"
            value={typedName}
            placeholder="Type your name"
            onChange={(e) => onTypedNameChange?.(e.target.value)}
            style={typedInputStyle}
            aria-label="Type your signature"
          />
        ) : null}
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={canvasStyle}
          role="img"
          aria-label={
            mode === "typed"
              ? "Typed signature preview"
              : "Draw your signature"
          }
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        />
      </div>
    );
  },
);
