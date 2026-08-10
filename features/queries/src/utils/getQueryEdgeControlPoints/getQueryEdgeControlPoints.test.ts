import { describe, expect, it } from 'vitest';
import { getQueryEdgeControlPoints } from './getQueryEdgeControlPoints';

describe('getQueryEdgeControlPoints', () => {
  it('bends proportionally to the horizontal distance', () => {
    const points = getQueryEdgeControlPoints(
      { x: 0, y: 10 },
      { x: 200, y: 50 },
    );

    // Control points extend horizontally out of the ports by
    // half the horizontal distance
    expect(points).toEqual([
      { x: 0, y: 10 },
      { x: 100, y: 10 },
      { x: 100, y: 50 },
      { x: 200, y: 50 },
    ]);
  });

  it('clamps the bend for short edges', () => {
    const [, control] = getQueryEdgeControlPoints(
      { x: 0, y: 0 },
      { x: 20, y: 0 },
    );

    // The bend never falls below the minimum curve strength
    expect(control).toEqual({ x: 40, y: 0 });
  });

  it('clamps the bend for long edges', () => {
    const [, control] = getQueryEdgeControlPoints(
      { x: 0, y: 0 },
      { x: 1000, y: 0 },
    );

    // The bend never exceeds the maximum curve strength
    expect(control).toEqual({ x: 160, y: 0 });
  });
});
