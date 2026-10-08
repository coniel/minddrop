import { describe, expect, it } from 'vitest';
import { isDeepEqual } from './isDeepEqual';

describe('isDeepEqual', () => {
  it('compares primitives by value', () => {
    expect(isDeepEqual('a', 'a')).toBe(true);
    expect(isDeepEqual(1, 2)).toBe(false);
    expect(isDeepEqual(null, undefined)).toBe(false);
  });

  it('compares dates by their time', () => {
    expect(isDeepEqual(new Date('2026-01-01'), new Date('2026-01-01'))).toBe(
      true,
    );
    expect(isDeepEqual(new Date('2026-01-01'), new Date('2026-01-02'))).toBe(
      false,
    );
    expect(isDeepEqual(new Date('2026-01-01'), '2026-01-01')).toBe(false);
  });

  it('compares arrays by their members in order', () => {
    expect(isDeepEqual([1, [2]], [1, [2]])).toBe(true);
    expect(isDeepEqual([1, 2], [2, 1])).toBe(false);
    expect(isDeepEqual([1], [1, 2])).toBe(false);
  });

  it('compares objects by their keys and values in any order', () => {
    expect(isDeepEqual({ a: 1, b: { c: 2 } }, { b: { c: 2 }, a: 1 })).toBe(
      true,
    );
    expect(isDeepEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(isDeepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(isDeepEqual({ a: undefined }, { b: undefined })).toBe(false);
  });

  it('does not equate an array with an object', () => {
    expect(isDeepEqual([], {})).toBe(false);
  });
});
