import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { a11y } from '../../test/a11y';
import { BrandLoader, loaderState } from './BrandLoader';
import { LOOP } from './logo-art';

describe('BrandLoader', () => {
  it('draws the logo path twice — the faint track and the masked fill — at the mark\'s ratio', async () => {
    const { container } = render(<BrandLoader size={96} label="Opening workspace" />);
    const svg = screen.getByRole('img', { name: 'Opening workspace' });
    expect(svg.getAttribute('width')).toBe('96');
    expect(svg.getAttribute('height')).toBe('50.4');
    const logo = [...svg.querySelectorAll('path')].filter((p) => p.getAttribute('d') === LOOP.paths[0]);
    expect(logo).toHaveLength(2);
    const maskId = svg.querySelector('mask')!.id;
    expect(logo[1]!.getAttribute('mask')).toBe(`url(#${maskId})`);
    await a11y(container);
  });

  it('drops the track when asked (small places)', () => {
    render(<BrandLoader track={false} tone="linen" />);
    const paths = screen.getByRole('img').querySelectorAll(':scope > path');
    expect(paths).toHaveLength(1);
    expect(paths[0]!.getAttribute('fill')).toBe('#F5F2EC');
  });

  it('gives each loader its own mask', () => {
    render(
      <>
        <BrandLoader />
        <BrandLoader />
      </>,
    );
    const ids = [...document.querySelectorAll('mask')].map((m) => m.id);
    expect(new Set(ids).size).toBe(2);
  });
});

describe('loaderState', () => {
  it('runs a short stroke, blooms into the whole mark, holds, gathers back', () => {
    expect(loaderState(0).s).toBeCloseTo(0.14);
    expect(loaderState(1).s).toBeCloseTo(0.14);
    expect(loaderState(2.5).s).toBe(1); // the hold: the logo itself
    expect(loaderState(3.4).s).toBeCloseTo(0.14); // the next round
  });

  it('moves the head without jumps', () => {
    let prev = loaderState(0).h;
    for (let t = 0.01; t < 7; t += 0.01) {
      const h = loaderState(t).h;
      expect(h - prev).toBeGreaterThanOrEqual(-1e-9);
      expect(h - prev).toBeLessThan(0.02);
      prev = h;
    }
  });
});
