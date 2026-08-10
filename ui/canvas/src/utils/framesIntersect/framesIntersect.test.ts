import { describe, expect, it } from 'vitest';
import { framesIntersect } from './framesIntersect';

const frame = { x: 0, y: 0, width: 200, height: 100 };

describe('framesIntersect', () => {
  it('returns true for overlapping frames', () => {
    expect(
      framesIntersect(frame, { x: 100, y: 50, width: 200, height: 100 }),
    ).toBe(true);
  });

  it('returns true for a contained frame', () => {
    expect(
      framesIntersect(frame, { x: 20, y: 20, width: 20, height: 20 }),
    ).toBe(true);
  });

  it('returns true for frames touching along an edge', () => {
    expect(
      framesIntersect(frame, { x: 200, y: 0, width: 100, height: 100 }),
    ).toBe(true);
  });

  it('returns false for frames apart horizontally', () => {
    expect(
      framesIntersect(frame, { x: 300, y: 0, width: 100, height: 100 }),
    ).toBe(false);
  });

  it('returns false for frames apart vertically', () => {
    expect(
      framesIntersect(frame, { x: 0, y: 200, width: 100, height: 100 }),
    ).toBe(false);
  });
});
