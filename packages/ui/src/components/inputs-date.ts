// Date parsing for DateInput / FuzzyDateInput. Values are ISO strings
// (YYYY-MM-DD, or YYYY-MM / YYYY for a fuzzy date) — no time zones.

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export type PartialDate = { year: number; month?: number | undefined; day?: number | undefined };

const pad = (n: number) => String(n).padStart(2, '0');

export function daysIn(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function valid(p: PartialDate): boolean {
  if (!Number.isInteger(p.year) || p.year < 1000 || p.year > 9999) return false;
  if (p.month === undefined) return p.day === undefined;
  if (p.month < 1 || p.month > 12) return false;
  if (p.day === undefined) return true;
  return p.day >= 1 && p.day <= daysIn(p.year, p.month);
}

function monthOf(word: string): number | undefined {
  const i = MONTHS.indexOf(word.slice(0, 3).toLowerCase());
  return i < 0 ? undefined : i + 1;
}

/**
 * Parse what people type: 12/03/2019 (day first, British), 12.03.2019,
 * 2019-03-12, 12 Mar 2019, March 12 2019, 2019年3月12日 — and, when
 * `partial`, 2019-03, 03/2019, Mar 2019, 2019年3月, 2019. Returns null when
 * it cannot tell.
 */
export function parseDate(text: string, { partial = false }: { partial?: boolean } = {}): PartialDate | null {
  const t = text.trim().replace(/\s+/g, ' ');
  if (!t) return null;
  let m: RegExpMatchArray | null;
  let p: PartialDate | null = null;
  if ((m = t.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/))) p = { year: +m[1]!, month: +m[2]!, day: +m[3]! };
  else if ((m = t.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/))) p = { year: +m[3]!, month: +m[2]!, day: +m[1]! };
  else if ((m = t.match(/^(\d{1,2}) ([a-z]+)\.?,? (\d{4})$/i)) && monthOf(m[2]!)) p = { year: +m[3]!, month: monthOf(m[2]!), day: +m[1]! };
  else if ((m = t.match(/^([a-z]+)\.? (\d{1,2}),? (\d{4})$/i)) && monthOf(m[1]!)) p = { year: +m[3]!, month: monthOf(m[1]!), day: +m[2]! };
  else if ((m = t.match(/^(\d{4}) ?年 ?(\d{1,2}) ?月 ?(\d{1,2}) ?日?$/))) p = { year: +m[1]!, month: +m[2]!, day: +m[3]! };
  else if (partial) {
    if ((m = t.match(/^(\d{4})[-/.](\d{1,2})$/))) p = { year: +m[1]!, month: +m[2]! };
    else if ((m = t.match(/^(\d{1,2})[-/.](\d{4})$/))) p = { year: +m[2]!, month: +m[1]! };
    else if ((m = t.match(/^([a-z]+)\.? (\d{4})$/i)) && monthOf(m[1]!)) p = { year: +m[2]!, month: monthOf(m[1]!) };
    else if ((m = t.match(/^(\d{4}) ?年 ?(\d{1,2}) ?月$/))) p = { year: +m[1]!, month: +m[2]! };
    else if ((m = t.match(/^(\d{4})$/))) p = { year: +m[1]! };
  }
  return p && valid(p) ? p : null;
}

/** 2019-03-12 · 2019-03 · 2019 */
export function toIso(p: PartialDate): string {
  if (p.month === undefined) return String(p.year);
  if (p.day === undefined) return `${p.year}-${pad(p.month)}`;
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

/** Inverse of toIso; null for anything else. */
export function fromIso(iso: string | null | undefined): PartialDate | null {
  if (!iso) return null;
  const m = iso.match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/);
  if (!m) return null;
  const p: PartialDate = { year: +m[1]!, month: m[2] ? +m[2] : undefined, day: m[3] ? +m[3] : undefined };
  return valid(p) ? p : null;
}

/** 12 Mar 2019 · Mar 2019 · 2019 — or 2019 年 3 月 12 日 in Chinese. */
export function formatDate(p: PartialDate, lang: 'en' | 'zh' = 'en'): string {
  if (lang === 'zh') {
    return `${p.year} 年${p.month ? ` ${p.month} 月` : ''}${p.day ? ` ${p.day} 日` : ''}`;
  }
  if (p.month === undefined) return String(p.year);
  const mon = MONTH_NAMES[p.month - 1]!;
  return p.day === undefined ? `${mon} ${p.year}` : `${p.day} ${mon} ${p.year}`;
}

export function toDate(p: PartialDate): Date {
  return new Date(p.year, (p.month ?? 1) - 1, p.day ?? 1);
}

export function fromDate(d: Date): PartialDate {
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

/** zh when the element (or page) is Chinese. */
export function langOf(el: Element | null): 'en' | 'zh' {
  const lang = (el?.closest('[lang]')?.getAttribute('lang') ?? (typeof document !== 'undefined' ? document.documentElement.lang : '')).toLowerCase();
  return lang.startsWith('zh') ? 'zh' : 'en';
}
