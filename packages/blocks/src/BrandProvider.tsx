import { createContext, useContext, type ReactNode } from "react";

// BrandProvider — context carrying per-workspace brand config
// (logo URL, confidential-footer copy, color tokens) for Slide + Doc
// chrome. Isolated so white-labeling can swap workspace brand data
// without touching the render code.
//
// Default brand is the cosx wordmark for M4.5 (product-meta and
// htmlproc sidecar both render the same defaults). Product-meta will
// pass a workspace-scoped override once M6 wires the branding API.
//
// Usage:
//   <BrandProvider>
//     <BlockDocViewer .../>
//   </BrandProvider>
//
// Consumers of brand data:
//   const brand = useBrand();
//   <img src={brand.logoUrl} />

export interface BrandConfig {
  /** Header / footer logo URL. */
  logoUrl: string;
  /** Alt text for the logo (a11y). */
  logoAlt: string;
  /** Confidential-footer copy on Slide + Doc chrome. */
  confidentialFooter: string;
  /** Accent color CSS variable name (kit's `--ck-accent` by default). */
  accentVar: string;
}

// The default logo path is a leaf under the consumer's app root
// (`/cosx-logo.svg`). This package does NOT ship the SVG — consumers
// must either serve that path themselves (product-meta ships the
// file under web/public/) or pass a `brand={{ logoUrl: "..." }}`
// override. Server-side thumbnail renderers should pass a data:
// URI so the render doesn't need to fetch the SVG over network.
const defaultBrand: BrandConfig = {
  logoUrl: "/cosx-logo.svg",
  logoAlt: "COSX",
  confidentialFooter: "Confidential · Do not distribute",
  accentVar: "--ck-accent",
};

const BrandContext = createContext<BrandConfig>(defaultBrand);

export interface BrandProviderProps {
  brand?: Partial<BrandConfig> | undefined;
  children: ReactNode;
}

/**
 * BrandProvider — supplies brand config to block_doc chrome.
 *
 * Pass a partial override to customize per workspace / feature; the
 * remaining fields fall back to the defaults.
 */
export function BrandProvider({ brand, children }: BrandProviderProps) {
  const merged: BrandConfig = { ...defaultBrand, ...brand };
  return <BrandContext.Provider value={merged}>{children}</BrandContext.Provider>;
}

/** useBrand — read the current brand config. */
export function useBrand(): BrandConfig {
  return useContext(BrandContext);
}
