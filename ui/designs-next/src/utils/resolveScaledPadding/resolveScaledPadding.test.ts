import { describe, expect, it } from 'vitest';
import { resolveScaledPadding } from './resolveScaledPadding';

describe('resolveScaledPadding', () => {
  it('scales the sides by the unit size', () => {
    // A unit drawn at twice its pixel size doubles the padding too
    expect(resolveScaledPadding({ top: 16, left: 8 }, 8)).toEqual({
      top: 32,
      right: 0,
      bottom: 0,
      left: 16,
    });
  });

  it('resolves the sides of an element holding no padding', () => {
    expect(resolveScaledPadding(undefined, 4)).toEqual({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
  });
});
