import { describe, expect, it } from 'vitest';
import { unionFrames } from './unionFrames';

describe('unionFrames', () => {
  it('returns null when given no frames', () => {
    expect(unionFrames([])).toBeNull();
  });

  it('returns the frame itself when given one', () => {
    const frame = { x: 10, y: 20, width: 30, height: 40 };

    expect(unionFrames([frame])).toEqual(frame);
  });

  it('encloses frames spread apart', () => {
    expect(
      unionFrames([
        { x: 100, y: 100, width: 50, height: 50 },
        { x: 0, y: 20, width: 10, height: 10 },
      ]),
    ).toEqual({ x: 0, y: 20, width: 150, height: 130 });
  });

  it('encloses a frame contained within another', () => {
    expect(
      unionFrames([
        { x: 0, y: 0, width: 100, height: 100 },
        { x: 20, y: 20, width: 10, height: 10 },
      ]),
    ).toEqual({ x: 0, y: 0, width: 100, height: 100 });
  });
});
