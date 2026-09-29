import { axe } from 'vitest-axe';

/** Axe on a rendered container; colour contrast is checked visually
 *  (jsdom computes no styles), everything else must pass. */
export async function a11y(container: Element) {
  return axe(container, { rules: { 'color-contrast': { enabled: false } } });
}
