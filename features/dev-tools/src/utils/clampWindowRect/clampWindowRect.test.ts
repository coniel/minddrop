import { describe, expect, it } from 'vitest';
import { MinWindowSize } from '../../constants';
import { clampWindowRect } from './clampWindowRect';

const viewport = { width: 1200, height: 800 };

describe('clampWindowRect', () => {
  it('leaves a contained window untouched', () => {
    const rect = { x: 100, y: 100, width: 600, height: 400 };

    expect(clampWindowRect(rect, viewport)).toEqual(rect);
  });

  it('pulls the window back in from the right and bottom edges', () => {
    const rect = { x: 1000, y: 700, width: 600, height: 400 };

    expect(clampWindowRect(rect, viewport)).toEqual({
      x: viewport.width - 600,
      y: viewport.height - 400,
      width: 600,
      height: 400,
    });
  });

  it('pulls the window back in from the left and top edges', () => {
    const rect = { x: -50, y: -80, width: 600, height: 400 };

    expect(clampWindowRect(rect, viewport)).toEqual({
      x: 0,
      y: 0,
      width: 600,
      height: 400,
    });
  });

  it('shrinks a window larger than the viewport', () => {
    const rect = { x: 40, y: 40, width: 2000, height: 1400 };

    expect(clampWindowRect(rect, viewport)).toEqual({
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });
  });

  it('never shrinks below the minimum window size', () => {
    const rect = { x: 0, y: 0, width: 400, height: 300 };
    const clamped = clampWindowRect(rect, { width: 100, height: 100 });

    expect(clamped).toEqual({
      x: 0,
      y: 0,
      width: MinWindowSize.width,
      height: MinWindowSize.height,
    });
  });
});
