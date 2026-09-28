import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn', () => {
  it('joins and drops falsy', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
  });
  it('lets the later class win', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('rounded-sm', 'rounded-lg')).toBe('rounded-lg');
  });
  it('knows a kit size from a kit colour', () => {
    expect(cn('text-ui', 'text-fg')).toBe('text-ui text-fg');
    expect(cn('text-ui', 'text-body')).toBe('text-body');
    expect(cn('text-fg', 'text-fg-secondary')).toBe('text-fg-secondary');
  });
});
