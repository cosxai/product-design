import { describe, expect, it } from 'vitest';

import { LOOP, WORDMARK } from './logo-art';

// The wordmark is C, the O-loop and S as paths plus the X as a polygon in
// the source artwork: 3 shapes. The loop is one.
describe('logo artwork', () => {
  it('keeps every shape of the source SVGs', () => {
    expect(WORDMARK.paths).toHaveLength(3);
    expect(LOOP.paths).toHaveLength(1);
  });
});
