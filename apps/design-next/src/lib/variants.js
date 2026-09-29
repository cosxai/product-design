// Every site page is built four times — language × theme — so the first
// paint is already right. The Worker picks one from the visitor's cookie
// (dc/runtime.js remember()); the clean URL never changes.

export const VARIANTS = [
  { v: undefined, lang: 'en', theme: 'light' },
  { v: 'zh', lang: 'zh', theme: 'light' },
  { v: 'ink', lang: 'en', theme: 'dark' },
  { v: 'zh-ink', lang: 'zh', theme: 'dark' },
];

/** getStaticPaths for a page: all four variants, or just the default. */
export function variants(site) {
  return (site ? VARIANTS : VARIANTS.slice(0, 1)).map(({ v, lang, theme }) => ({ params: { v }, props: { state: site ? { lang, theme } : null } }));
}
