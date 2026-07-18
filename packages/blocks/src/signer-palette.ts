/**
 * SIGNER_PALETTE — canonical per-party colour, shared by every
 * surface that differentiates signers: the in-doc SIGNER pill
 * (BlockRenderer), product-layer binding badges (metaroom's
 * SigningConfigOverlay imports this), and any future signer UI.
 *
 * Slot 0 is the platform accent so single-party docs look identical
 * to the pre-bilateral era. Later slots are chosen for perceptual
 * distinctness on white (Tailwind emerald / amber / rose / sky /
 * violet / teal / fuchsia 600s).
 */
export const SIGNER_PALETTE: readonly string[] = Object.freeze([
  "var(--ck-accent, #4f46e5)",
  "#059669", // emerald-600
  "#d97706", // amber-600
  "#e11d48", // rose-600
  "#0284c7", // sky-600
  "#7c3aed", // violet-600
  "#0d9488", // teal-600
  "#c026d3", // fuchsia-600
]);

/** Colour for a party index; slate fallback keeps renders safe when
 *  data gets ahead of the palette. */
export function signerColor(index: number): string {
  return SIGNER_PALETTE[index] ?? "#64748b";
}
