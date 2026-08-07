import { describe, expect, it } from 'vitest';
import { isExpandableLogValue } from './isExpandableLogValue';

describe('isExpandableLogValue', () => {
  it('returns true for objects and arrays', () => {
    expect(isExpandableLogValue({ a: 1 })).toBe(true);
    expect(isExpandableLogValue([1, 2])).toBe(true);
  });

  it('returns false for primitives', () => {
    expect(isExpandableLogValue('text')).toBe(false);
    expect(isExpandableLogValue(1)).toBe(false);
    expect(isExpandableLogValue(null)).toBe(false);
    expect(isExpandableLogValue(undefined)).toBe(false);
  });

  it('returns false for errors, which render as text', () => {
    expect(isExpandableLogValue(new Error('boom'))).toBe(false);
  });
});
