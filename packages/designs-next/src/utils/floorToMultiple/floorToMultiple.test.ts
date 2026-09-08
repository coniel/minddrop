import { describe, expect, it } from 'vitest';
import { floorToMultiple } from './floorToMultiple';

describe('floorToMultiple', () => {
  it('rounds down to the multiple the value falls on', () => {
    expect(floorToMultiple(5, 4)).toBe(4);
    expect(floorToMultiple(7, 4)).toBe(4);
  });

  it('keeps exact multiples unchanged', () => {
    expect(floorToMultiple(8, 4)).toBe(8);
  });

  it('rounds down to integers at a snap of one', () => {
    expect(floorToMultiple(2.9, 1)).toBe(2);
  });

  it('rounds negative values away from zero', () => {
    expect(floorToMultiple(-0.5, 4)).toBe(-4);
  });
});
