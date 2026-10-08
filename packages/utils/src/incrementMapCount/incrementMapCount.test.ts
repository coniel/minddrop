import { describe, expect, it } from 'vitest';
import { incrementMapCount } from './incrementMapCount';

describe('incrementMapCount', () => {
  it('counts a new key from one', () => {
    const counts = new Map<string, number>();

    incrementMapCount(counts, 'a');

    expect(counts.get('a')).toBe(1);
  });

  it('adds one to an existing count', () => {
    const counts = new Map([['a', 2]]);

    incrementMapCount(counts, 'a');

    expect(counts.get('a')).toBe(3);
  });

  it('leaves the counts of other keys unchanged', () => {
    const counts = new Map([['b', 2]]);

    incrementMapCount(counts, 'a');

    expect(counts.get('b')).toBe(2);
  });

  it('returns the new count', () => {
    const counts = new Map([['a', 4]]);

    expect(incrementMapCount(counts, 'a')).toBe(5);
  });
});
