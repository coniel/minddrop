import { describe, expect, it } from 'vitest';
import { resolveScaledWidths } from './resolveScaledWidths';

describe('resolveScaledWidths', () => {
  it('divides the target evenly across scaling columns', () => {
    expect(resolveScaledWidths([true, false, true], 8)).toEqual([4, 1, 4]);
  });

  it('rounds uneven divisions onto whole units', () => {
    expect(resolveScaledWidths([true, true, true], 10)).toEqual([3, 4, 3]);
  });

  it('keeps non-scaling columns one unit wide', () => {
    expect(resolveScaledWidths([false, true, false], 5)).toEqual([1, 5, 1]);
  });

  it('sums scaling widths to the target total', () => {
    const widths = resolveScaledWidths([true, false, true, true, true], 13);
    const scalingTotal = widths[0] + widths[2] + widths[3] + widths[4];

    expect(scalingTotal).toBe(13);
  });

  it('preserves proportional positions when columns shrink below one unit', () => {
    // Halving 48 scaling columns leaves half a unit per column, spread
    // evenly rather than piled onto the leftmost columns
    const widths = resolveScaledWidths(new Array<boolean>(48).fill(true), 24);
    const firstHalfTotal = widths
      .slice(0, 24)
      .reduce((total, width) => total + width, 0);

    expect(firstHalfTotal).toBe(12);
  });
});
