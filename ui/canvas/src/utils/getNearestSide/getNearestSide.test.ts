import { describe, expect, it } from 'vitest';
import { getNearestSide } from './getNearestSide';

const frame = { x: 0, y: 0, width: 200, height: 100 };

describe('getNearestSide', () => {
  it('returns the side nearest to a point above the frame', () => {
    expect(getNearestSide(frame, { x: 100, y: -50 })).toBe('top');
  });

  it('returns the side nearest to a point right of the frame', () => {
    expect(getNearestSide(frame, { x: 250, y: 50 })).toBe('right');
  });

  it('returns the side nearest to a point below the frame', () => {
    expect(getNearestSide(frame, { x: 100, y: 150 })).toBe('bottom');
  });

  it('returns the side nearest to a point left of the frame', () => {
    expect(getNearestSide(frame, { x: -50, y: 50 })).toBe('left');
  });

  it('returns the nearest side for points inside the frame', () => {
    expect(getNearestSide(frame, { x: 190, y: 50 })).toBe('right');
  });
});
