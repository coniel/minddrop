import { describe, expect, it } from 'vitest';
import { computeFitTransform } from './computeFitTransform';

const viewport = { width: 1000, height: 800 };

describe('computeFitTransform', () => {
  it('returns null when there are no frames', () => {
    expect(computeFitTransform([], viewport)).toBeNull();
  });

  it('returns null when the viewport is unmeasured', () => {
    expect(
      computeFitTransform([{ x: 0, y: 0, width: 100, height: 100 }], {
        width: 0,
        height: 0,
      }),
    ).toBeNull();
  });

  it('centers a small frame at 100% zoom', () => {
    const transform = computeFitTransform(
      [{ x: 0, y: 0, width: 100, height: 100 }],
      viewport,
    );

    // A small frame fits without scaling, so zoom caps at 100%
    expect(transform?.zoom).toBe(1);
    // Centered: (1000 - 100) / 2, (800 - 100) / 2
    expect(transform?.pan).toEqual({ x: 450, y: 350 });
  });

  it('zooms out to fit large bounds with padding', () => {
    const transform = computeFitTransform(
      [
        { x: 0, y: 0, width: 500, height: 500 },
        { x: 1500, y: 0, width: 500, height: 500 },
      ],
      viewport,
      { padding: 50 },
    );

    // Bounds are 2000x500; width constrains: (1000 - 100) / 2000
    expect(transform?.zoom).toBe(0.45);
    // Centered horizontally with padding: (1000 - 2000 * 0.45) / 2
    expect(transform?.pan.x).toBe(50);
    // Centered vertically: (800 - 500 * 0.45) / 2
    expect(transform?.pan.y).toBe(287.5);
  });

  it('offsets the pan by the bounds origin', () => {
    const transform = computeFitTransform(
      [{ x: 200, y: -100, width: 100, height: 100 }],
      viewport,
    );

    // Same as the origin-anchored fit, shifted by -origin * zoom
    expect(transform?.pan).toEqual({ x: 450 - 200, y: 350 + 100 });
  });

  it('clamps the zoom to minZoom', () => {
    const transform = computeFitTransform(
      [{ x: 0, y: 0, width: 100000, height: 100 }],
      viewport,
      { minZoom: 0.1 },
    );

    expect(transform?.zoom).toBe(0.1);
  });
});
