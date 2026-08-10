import { describe, expect, it } from 'vitest';
import { getAlignmentLines } from './getAlignmentLines';

const frame = { x: 100, y: 50, width: 200, height: 100 };

describe('getAlignmentLines', () => {
  it('returns the left edge, center and right edge on the x axis', () => {
    expect(getAlignmentLines(frame, 'x')).toEqual([100, 200, 300]);
  });

  it('returns the top edge, center and bottom edge on the y axis', () => {
    expect(getAlignmentLines(frame, 'y')).toEqual([50, 100, 150]);
  });
});
