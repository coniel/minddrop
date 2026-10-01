import { describe, expect, it } from 'vitest';
import { uniqueShortId } from './uniqueShortId';

describe('uniqueShortId', () => {
  it('generates the requested length', () => {
    expect(uniqueShortId([], 12)).toHaveLength(12);
  });

  it('generates an ID none of the existing IDs equals', () => {
    // Every single-character ID but one
    const existingIds = 'abcdefghijklmnopqrstuvwxyz012345678'.split('');

    // The only ID left should be generated
    expect(uniqueShortId(existingIds, 1)).toBe('9');
  });

  it('generates a different ID on each call', () => {
    expect(uniqueShortId([])).not.toBe(uniqueShortId([]));
  });
});
