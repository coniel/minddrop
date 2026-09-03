import { describe, expect, it } from 'vitest';
import { snapToMultiple } from './snapToMultiple';

describe('snapToMultiple', () => {
  it('rounds to the nearest multiple', () => {
    expect(snapToMultiple(5, 4)).toBe(4);
    expect(snapToMultiple(7, 4)).toBe(8);
  });

  it('keeps exact multiples unchanged', () => {
    expect(snapToMultiple(8, 4)).toBe(8);
  });

  it('rounds halfway values up', () => {
    expect(snapToMultiple(6, 4)).toBe(8);
  });

  it('rounds to integers at a snap of one', () => {
    expect(snapToMultiple(2.4, 1)).toBe(2);
  });
});
