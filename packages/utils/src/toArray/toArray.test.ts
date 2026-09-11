import { describe, expect, it } from 'vitest';
import { toArray } from './toArray';

describe('toArray', () => {
  it('returns arrays as they are', () => {
    const value = ['a', 'b'];

    expect(toArray(value)).toBe(value);
  });

  it('wraps a single value', () => {
    expect(toArray('a')).toEqual(['a']);
  });

  it('returns an empty array for null and undefined', () => {
    expect(toArray(null)).toEqual([]);
    expect(toArray(undefined)).toEqual([]);
  });
});
