import { describe, expect, it } from 'vitest';
import { normalizeRect } from './normalizeRect';

describe('normalizeRect', () => {
  it('orders the corners lower left to upper right', () => {
    expect(normalizeRect([100, 200, 10, 20])).toEqual([10, 20, 100, 200]);
  });

  it('keeps an ordered rect as it is', () => {
    expect(normalizeRect([10, 20, 100, 200])).toEqual([10, 20, 100, 200]);
  });
});
