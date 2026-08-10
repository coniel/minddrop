import { describe, expect, it } from 'vitest';
import { getEdgeSnap } from './getEdgeSnap';

const target = { x: 100, y: 100, width: 200, height: 100 };
const span = { start: 400, end: 500 };

describe('getEdgeSnap', () => {
  it('leaves the edge unchanged when nothing is within range', () => {
    const result = getEdgeSnap(500, span, [target], 8, 'x');

    expect(result.position).toBe(500);
    expect(result.guide).toBeNull();
  });

  it('snaps the edge onto a target edge', () => {
    const result = getEdgeSnap(304, span, [target], 8, 'x');

    expect(result.position).toBe(300);
  });

  it('snaps the edge onto a target center', () => {
    const result = getEdgeSnap(197, span, [target], 8, 'x');

    expect(result.position).toBe(200);
  });

  it('snaps to the nearest alignment line', () => {
    // 2 from the target's right edge, 8 from its center
    const result = getEdgeSnap(298, span, [target], 10, 'x');

    expect(result.position).toBe(300);
  });

  it('returns a guide spanning the frame and the target', () => {
    const result = getEdgeSnap(304, span, [target], 8, 'x');

    expect(result.guide).toEqual({
      axis: 'x',
      position: 300,
      start: 100,
      end: 500,
    });
  });

  it('extends the guide over every frame it aligns', () => {
    const result = getEdgeSnap(
      304,
      span,
      [target, { x: 300, y: 600, width: 40, height: 50 }],
      8,
      'x',
    );

    expect(result.guide).toEqual({
      axis: 'x',
      position: 300,
      start: 100,
      end: 650,
    });
  });

  it('snaps edges on the y axis', () => {
    const result = getEdgeSnap(196, { start: 400, end: 500 }, [target], 8, 'y');

    expect(result.position).toBe(200);
    expect(result.guide).toEqual({
      axis: 'y',
      position: 200,
      start: 100,
      end: 500,
    });
  });
});
