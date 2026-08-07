import { describe, expect, it } from 'vitest';
import { MinWindowSize } from '../../constants';
import { getResizedWindowRect } from './getResizedWindowRect';

const rect = { x: 100, y: 100, width: 600, height: 400 };
const viewport = { width: 1200, height: 800 };

describe('getResizedWindowRect', () => {
  it('grows the width and height from the south east corner', () => {
    expect(
      getResizedWindowRect(rect, 'se', { x: 50, y: 20 }, viewport),
    ).toEqual({
      x: 100,
      y: 100,
      width: 650,
      height: 420,
    });
  });

  it('keeps the opposite edges in place when resizing north west', () => {
    expect(
      getResizedWindowRect(rect, 'nw', { x: 50, y: 20 }, viewport),
    ).toEqual({
      x: 150,
      y: 120,
      width: 550,
      height: 380,
    });
  });

  it('leaves the perpendicular axis untouched', () => {
    expect(getResizedWindowRect(rect, 'n', { x: 50, y: 20 }, viewport)).toEqual(
      {
        x: 100,
        y: 100 + 20,
        width: 600,
        height: 380,
      },
    );
  });

  it('clamps to the minimum window size', () => {
    const resized = getResizedWindowRect(
      rect,
      'se',
      { x: -1000, y: -1000 },
      viewport,
    );

    expect(resized.width).toBe(MinWindowSize.width);
    expect(resized.height).toBe(MinWindowSize.height);
  });

  it('stops moving the position once clamped', () => {
    const resized = getResizedWindowRect(
      rect,
      'nw',
      { x: 1000, y: 1000 },
      viewport,
    );

    expect(resized.x).toBe(rect.x + rect.width - MinWindowSize.width);
    expect(resized.y).toBe(rect.y + rect.height - MinWindowSize.height);
  });

  it('stops the east and south edges at the viewport', () => {
    const resized = getResizedWindowRect(
      rect,
      'se',
      { x: 5000, y: 5000 },
      viewport,
    );

    expect(resized.x + resized.width).toBe(viewport.width);
    expect(resized.y + resized.height).toBe(viewport.height);
  });

  it('stops the west and north edges at the viewport, keeping the opposite edges in place', () => {
    const resized = getResizedWindowRect(
      rect,
      'nw',
      { x: -5000, y: -5000 },
      viewport,
    );

    expect(resized.x).toBe(0);
    expect(resized.y).toBe(0);
    expect(resized.width).toBe(rect.x + rect.width);
    expect(resized.height).toBe(rect.y + rect.height);
  });
});
