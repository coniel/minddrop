import { describe, expect, it } from 'vitest';
import { resolveEdgeVelocity } from './resolveEdgeVelocity';

// Edge zones of 100px scrolling at up to 10px per frame
const options = { edgeSize: 100, maxSpeed: 10 };

describe('resolveEdgeVelocity', () => {
  it('is zero away from the edges', () => {
    expect(resolveEdgeVelocity(500, 0, 1000, options)).toBe(0);
  });

  it('scrolls backwards near the leading edge', () => {
    expect(resolveEdgeVelocity(50, 0, 1000, options)).toBe(-5);
  });

  it('scrolls forwards near the trailing edge', () => {
    expect(resolveEdgeVelocity(950, 0, 1000, options)).toBe(5);
  });

  it('scrolls at full speed past the bounds', () => {
    expect(resolveEdgeVelocity(-50, 0, 1000, options)).toBe(-10);
    expect(resolveEdgeVelocity(1050, 0, 1000, options)).toBe(10);
  });
});
