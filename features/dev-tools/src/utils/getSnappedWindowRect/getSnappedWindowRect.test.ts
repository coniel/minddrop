import { describe, expect, it } from 'vitest';
import { SnappedWindowGap, SnappedWindowWidth } from '../../constants';
import { getSnappedWindowRect } from './getSnappedWindowRect';

const viewport = { width: 1200, height: 800 };

describe('getSnappedWindowRect', () => {
  it('snaps to the left edge', () => {
    expect(getSnappedWindowRect('left', viewport)).toEqual({
      x: SnappedWindowGap,
      y: SnappedWindowGap,
      width: SnappedWindowWidth,
      height: viewport.height - SnappedWindowGap * 2,
    });
  });

  it('snaps to the right edge', () => {
    expect(getSnappedWindowRect('right', viewport)).toEqual({
      x: viewport.width - SnappedWindowWidth - SnappedWindowGap,
      y: SnappedWindowGap,
      width: SnappedWindowWidth,
      height: viewport.height - SnappedWindowGap * 2,
    });
  });
});
