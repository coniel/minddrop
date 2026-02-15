import { describe, expect, it } from 'vitest';
import { deepMerge } from './deepMerge';

describe('deepMerge', () => {
  it('deeply merges two objects', () => {
    const target = { a: 1, b: 2, c: { d: 3, e: 4 } };
    const source = { a: 5, d: 3, c: { e: 9, f: 10 } };

    const merged = deepMerge<any>(target, source);

    expect(merged).toEqual({
      a: 5,
      b: 2,
      d: 3,
      c: { d: 3, e: 9, f: 10 },
    });
  });
});
