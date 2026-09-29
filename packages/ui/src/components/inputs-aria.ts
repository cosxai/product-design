/** Only the aria props that were given — Radix roots reject explicit
 *  undefined under exactOptionalPropertyTypes. */
export function definedAria(aria: Record<string, string | undefined>): Record<string, string> {
  return Object.fromEntries(Object.entries(aria).filter(([, v]) => v !== undefined)) as Record<string, string>;
}
