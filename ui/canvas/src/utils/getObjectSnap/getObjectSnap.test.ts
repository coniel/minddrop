import { describe, expect, it } from 'vitest';
import { getObjectSnap } from './getObjectSnap';

const target = { x: 100, y: 100, width: 200, height: 100 };

describe('getObjectSnap', () => {
  it('leaves the position unchanged when nothing is within range', () => {
    const result = getObjectSnap(
      { x: 500, y: 500, width: 100, height: 100 },
      [target],
      8,
    );

    expect(result.x).toBe(500);
    expect(result.y).toBe(500);
    expect(result.guides).toEqual([]);
  });

  it('snaps a near edge onto the target edge', () => {
    const result = getObjectSnap(
      { x: 104, y: 400, width: 100, height: 100 },
      [target],
      8,
    );

    expect(result.x).toBe(100);
    expect(result.y).toBe(400);
  });

  it('snaps centers together', () => {
    // The frame's center sits 3px left of the target's center
    const result = getObjectSnap(
      { x: 147, y: 400, width: 100, height: 100 },
      [target],
      8,
    );

    expect(result.x).toBe(150);
  });

  it('snaps both axes independently', () => {
    const result = getObjectSnap(
      { x: 103, y: 197, width: 100, height: 100 },
      [target],
      8,
    );

    expect(result.x).toBe(100);
    expect(result.y).toBe(200);
  });

  it('snaps to the nearest alignment line', () => {
    // 2px from the target's right edge, 8px from its center
    const result = getObjectSnap(
      { x: 202, y: 400, width: 100, height: 100 },
      [target],
      10,
    );

    expect(result.x).toBe(200);
  });

  it('returns a guide spanning both frames', () => {
    const result = getObjectSnap(
      { x: 104, y: 400, width: 90, height: 100 },
      [target],
      8,
    );

    expect(result.guides).toEqual([
      { axis: 'x', position: 100, start: 100, end: 500 },
    ]);
  });

  it('extends a guide over every frame it aligns', () => {
    const result = getObjectSnap(
      { x: 104, y: 400, width: 90, height: 100 },
      [target, { x: 100, y: 600, width: 40, height: 50 }],
      8,
    );

    expect(result.guides).toEqual([
      { axis: 'x', position: 100, start: 100, end: 650 },
    ]);
  });

  it('returns a guide for each aligned line', () => {
    const result = getObjectSnap(
      { x: 100, y: 400, width: 200, height: 100 },
      [target],
      8,
    );

    // The frame's left, center and right edges all align with the
    // target's, which has the same width and position
    expect(result.guides).toHaveLength(3);
    expect(result.guides.map((guide) => guide.position)).toEqual([
      100, 200, 300,
    ]);
  });
});
