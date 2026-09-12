import { describe, expect, it } from 'vitest';
import { clamp } from './clamp';

describe('clamp', () => {
  it('returns a value inside the bounds unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('raises a value below the minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('lowers a value above the maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('returns the maximum when it falls below the minimum', () => {
    expect(clamp(5, 10, 0)).toBe(0);
  });
});
