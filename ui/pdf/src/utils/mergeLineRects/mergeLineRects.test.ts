import { describe, expect, it } from 'vitest';
import { mergeLineRects } from './mergeLineRects';

describe('mergeLineRects', () => {
  it('merges fragments on one line into one rect', () => {
    expect(
      mergeLineRects([
        [10, 100, 50, 112],
        [50, 101, 120, 113],
      ]),
    ).toEqual([[10, 100, 120, 113]]);
  });

  it('keeps rects on different lines apart', () => {
    expect(
      mergeLineRects([
        [10, 100, 120, 112],
        [10, 80, 60, 92],
      ]),
    ).toEqual([
      [10, 100, 120, 112],
      [10, 80, 60, 92],
    ]);
  });

  it('keeps rects whose vertical overlap is under half their height apart', () => {
    // Overlapping by 4 of 12 points: a superscript rather than a
    // fragment of the same line.
    expect(
      mergeLineRects([
        [10, 100, 50, 112],
        [50, 108, 60, 120],
      ]),
    ).toHaveLength(2);
  });

  it('does not mutate the given rects', () => {
    const rect: [number, number, number, number] = [10, 100, 50, 112];

    mergeLineRects([rect, [50, 100, 120, 112]]);

    expect(rect).toEqual([10, 100, 50, 112]);
  });
});
