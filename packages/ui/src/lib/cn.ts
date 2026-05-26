// Lightweight className merge. Filters falsy values and joins with a
// single space. Sufficient for component composition; if a consumer
// needs tailwind-merge / clsx semantics they can swap implementations
// without touching call sites.
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ");
}
