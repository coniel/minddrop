import { describe, expect, it } from 'vitest';
import { getSideAnchorPoint } from './getSideAnchorPoint';

// A node frame at (100, 200) sized 220 x 80
const frame = { x: 100, y: 200, width: 220, height: 80 };

describe('getSideAnchorPoint', () => {
  it('anchors at the side midpoint without an offset', () => {
    expect(getSideAnchorPoint(frame, 'right')).toEqual({ x: 320, y: 240 });
  });

  it('anchors left/right sides at the offset from the top corner', () => {
    expect(getSideAnchorPoint(frame, 'left', 19)).toEqual({ x: 100, y: 219 });
    expect(getSideAnchorPoint(frame, 'right', 19)).toEqual({ x: 320, y: 219 });
  });

  it('anchors top/bottom sides at the offset from the left corner', () => {
    expect(getSideAnchorPoint(frame, 'top', 30)).toEqual({ x: 130, y: 200 });
    expect(getSideAnchorPoint(frame, 'bottom', 30)).toEqual({ x: 130, y: 280 });
  });

  it('clamps offsets to the side length', () => {
    // Beyond the side's far corner
    expect(getSideAnchorPoint(frame, 'left', 500)).toEqual({ x: 100, y: 280 });

    // Before the side's start corner
    expect(getSideAnchorPoint(frame, 'top', -10)).toEqual({ x: 100, y: 200 });
  });
});
