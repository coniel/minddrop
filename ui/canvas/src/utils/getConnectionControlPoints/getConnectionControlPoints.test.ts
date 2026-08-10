import { describe, expect, it } from 'vitest';
import { getConnectionControlPoints } from './getConnectionControlPoints';

describe('getConnectionControlPoints', () => {
  it('extends control points perpendicular out of each side', () => {
    const [c1, c2] = getConnectionControlPoints(
      { point: { x: 0, y: 0 }, side: 'right' },
      { point: { x: 200, y: 0 }, side: 'left' },
    );

    // Offset is half the 200px separation
    expect(c1).toEqual({ x: 100, y: 0 });
    expect(c2).toEqual({ x: 100, y: 0 });
  });

  it('clamps the offset to the minimum for close anchors', () => {
    const [c1, c2] = getConnectionControlPoints(
      { point: { x: 0, y: 0 }, side: 'bottom' },
      { point: { x: 0, y: 10 }, side: 'top' },
    );

    expect(c1).toEqual({ x: 0, y: 40 });
    expect(c2).toEqual({ x: 0, y: -30 });
  });

  it('clamps the offset to the maximum for distant anchors', () => {
    const [c1] = getConnectionControlPoints(
      { point: { x: 0, y: 0 }, side: 'right' },
      { point: { x: 2000, y: 0 }, side: 'left' },
    );

    expect(c1).toEqual({ x: 200, y: 0 });
  });
});
