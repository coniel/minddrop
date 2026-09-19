import { describe, expect, it } from 'vitest';
import { canScrollBy } from './canScrollBy';

describe('canScrollBy', () => {
  it('can move backwards from past the start', () => {
    expect(canScrollBy(10, 100, -5)).toBe(true);
    expect(canScrollBy(0, 100, -5)).toBe(false);
  });

  it('can move forwards from short of the end', () => {
    expect(canScrollBy(10, 100, 5)).toBe(true);
    expect(canScrollBy(100, 100, 5)).toBe(false);
  });

  it('cannot move by nothing', () => {
    expect(canScrollBy(10, 100, 0)).toBe(false);
  });
});
