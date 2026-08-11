import { describe, expect, it } from 'vitest';
import { pointInFrame } from './pointInFrame';

const frame = { x: 100, y: 50, width: 200, height: 100 };

describe('pointInFrame', () => {
  it('returns true for a point inside the frame', () => {
    expect(pointInFrame({ x: 150, y: 100 }, frame)).toBe(true);
  });

  it('returns true for a point on the frame edges', () => {
    expect(pointInFrame({ x: 100, y: 50 }, frame)).toBe(true);
    expect(pointInFrame({ x: 300, y: 150 }, frame)).toBe(true);
  });

  it('returns false for a point outside the frame', () => {
    expect(pointInFrame({ x: 99, y: 100 }, frame)).toBe(false);
    expect(pointInFrame({ x: 150, y: 151 }, frame)).toBe(false);
  });
});
