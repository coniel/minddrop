import { describe, expect, it } from 'vitest';
import { isPointInRect } from './isPointInRect';

// A box spanning 10 to 110 across and 20 to 70 down
const rect = { left: 10, top: 20, width: 100, height: 50 };

describe('isPointInRect', () => {
  it('recognises a point inside the box', () => {
    expect(isPointInRect({ x: 50, y: 40 }, rect)).toBe(true);
  });

  it('counts a point on the edge as inside', () => {
    expect(isPointInRect({ x: 10, y: 20 }, rect)).toBe(true);
    expect(isPointInRect({ x: 110, y: 70 }, rect)).toBe(true);
  });

  it('rejects a point outside the box', () => {
    expect(isPointInRect({ x: 9, y: 40 }, rect)).toBe(false);
    expect(isPointInRect({ x: 50, y: 71 }, rect)).toBe(false);
  });
});
