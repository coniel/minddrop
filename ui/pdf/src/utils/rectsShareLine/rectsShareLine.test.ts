import { describe, expect, it } from 'vitest';
import { rectsShareLine } from './rectsShareLine';

describe('rectsShareLine', () => {
  it('recognises fragments of one line', () => {
    expect(rectsShareLine([10, 100, 50, 112], [50, 101, 120, 113])).toBe(true);
  });

  it('rejects rects on different lines', () => {
    expect(rectsShareLine([10, 100, 120, 112], [10, 80, 60, 92])).toBe(false);
  });

  it('rejects rects overlapping by under half their height', () => {
    // Overlapping by 4 of 12 points: a superscript rather than a
    // fragment of the same line.
    expect(rectsShareLine([10, 100, 50, 112], [50, 108, 60, 120])).toBe(false);
  });
});
