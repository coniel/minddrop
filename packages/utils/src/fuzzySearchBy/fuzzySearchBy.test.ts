import { describe, expect, it } from 'vitest';
import { fuzzySearchBy } from './fuzzySearchBy';

const apple = { id: 'apple', name: 'Apple' };
const apricot = { id: 'apricot', name: 'Apricot' };
const banana = { id: 'banana', name: 'Banana' };
const otherApple = { id: 'apple-2', name: 'Apple' };

const items = [apple, apricot, banana, otherApple];

describe('fuzzySearchBy', () => {
  it('matches items by the given value', () => {
    expect(fuzzySearchBy(items, 'banana', (item) => item.name)).toEqual([
      banana,
    ]);
  });

  it('returns every item sharing a matched value', () => {
    expect(fuzzySearchBy(items, 'Apple', (item) => item.name)).toEqual([
      apple,
      otherApple,
    ]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(fuzzySearchBy(items, 'xyzq', (item) => item.name)).toEqual([]);
  });

  it('matches an item on any of several values', () => {
    const fruit = { id: 'fruit', name: 'Apple', variety: 'Bramley' };

    expect(
      fuzzySearchBy([fruit], 'Bramley', (item) => [item.name, item.variety]),
    ).toEqual([fruit]);
  });

  it('returns an item matched on several of its values once', () => {
    const fruit = { id: 'fruit', name: 'Apple', variety: 'Apples' };

    expect(
      fuzzySearchBy([fruit], 'Apple', (item) => [item.name, item.variety]),
    ).toEqual([fruit]);
  });
});
