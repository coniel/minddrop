import { describe, expect, it } from 'vitest';
import { sameIds } from './sameIds';

describe('sameIds', () => {
  it('returns true for identical lists', () => {
    expect(sameIds(['a', 'b'], ['a', 'b'])).toBe(true);
  });

  it('returns true for the same IDs in a different order', () => {
    expect(sameIds(['a', 'b', 'c'], ['c', 'a', 'b'])).toBe(true);
  });

  it('returns true for two empty lists', () => {
    expect(sameIds([], [])).toBe(true);
  });

  it('returns false for lists of differing length', () => {
    expect(sameIds(['a'], ['a', 'b'])).toBe(false);
  });

  it('returns false for lists containing different IDs', () => {
    expect(sameIds(['a', 'b'], ['a', 'c'])).toBe(false);
  });
});
