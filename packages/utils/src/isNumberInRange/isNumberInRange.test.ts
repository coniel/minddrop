import { describe, expect, it } from 'vitest';
import { isNumberInRange } from './isNumberInRange';

describe('isNumberInRange', () => {
  it('accepts a number inside the bounds', () => {
    expect(isNumberInRange(5, 0, 10)).toBe(true);
  });

  it('accepts the bounds themselves', () => {
    expect(isNumberInRange(0, 0, 10)).toBe(true);
    expect(isNumberInRange(10, 0, 10)).toBe(true);
  });

  it('rejects a number outside the bounds', () => {
    expect(isNumberInRange(-1, 0, 10)).toBe(false);
    expect(isNumberInRange(11, 0, 10)).toBe(false);
  });

  it('accepts any number above the minimum without a maximum', () => {
    expect(isNumberInRange(1000, 0)).toBe(true);
  });

  it('rejects non-numbers and non-finite numbers', () => {
    expect(isNumberInRange('5', 0, 10)).toBe(false);
    expect(isNumberInRange(undefined, 0, 10)).toBe(false);
    expect(isNumberInRange(Infinity, 0)).toBe(false);
    expect(isNumberInRange(NaN, 0, 10)).toBe(false);
  });
});
