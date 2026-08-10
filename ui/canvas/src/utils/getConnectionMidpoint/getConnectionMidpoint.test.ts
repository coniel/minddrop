import { describe, expect, it } from 'vitest';
import { getConnectionMidpoint } from './getConnectionMidpoint';

describe('getConnectionMidpoint', () => {
  it('returns the halfway point of a symmetric curve', () => {
    const midpoint = getConnectionMidpoint(
      { point: { x: 0, y: 0 }, side: 'right' },
      { point: { x: 200, y: 0 }, side: 'left' },
    );

    expect(midpoint).toEqual({ x: 100, y: 0 });
  });

  it('bulges toward the control points of facing sides', () => {
    const midpoint = getConnectionMidpoint(
      { point: { x: 0, y: 0 }, side: 'right' },
      { point: { x: 0, y: 200 }, side: 'right' },
    );

    // Both control points extend rightward, pulling the midpoint
    // right of the straight line between the anchors
    expect(midpoint.x).toBeGreaterThan(0);
    expect(midpoint.y).toBe(100);
  });
});
