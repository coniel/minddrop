import { describe, expect, it } from 'vitest';
import { getViewportFrame } from './getViewportFrame';

describe('getViewportFrame', () => {
  it('returns the viewport area at 100% zoom', () => {
    const frame = getViewportFrame({ x: 0, y: 0 }, 1, {
      width: 800,
      height: 600,
    });

    expect(frame).toEqual({ x: 0, y: 0, width: 800, height: 600 });
  });

  it('offsets the area by the pan', () => {
    const frame = getViewportFrame({ x: -100, y: -50 }, 1, {
      width: 800,
      height: 600,
    });

    expect(frame).toEqual({ x: 100, y: 50, width: 800, height: 600 });
  });

  it('scales the area by the zoom', () => {
    const frame = getViewportFrame({ x: -200, y: 0 }, 2, {
      width: 800,
      height: 600,
    });

    expect(frame).toEqual({ x: 100, y: 0, width: 400, height: 300 });
  });

  it('returns null for an unmeasured viewport', () => {
    expect(getViewportFrame({ x: 0, y: 0 }, 1, { width: 0, height: 0 })).toBe(
      null,
    );
  });
});
