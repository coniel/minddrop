import { describe, expect, it } from 'vitest';
import { getFrameFromPoints } from './getFrameFromPoints';

describe('getFrameFromPoints', () => {
  it('spans two corners dragged down and right', () => {
    expect(getFrameFromPoints({ x: 10, y: 20 }, { x: 40, y: 60 })).toEqual({
      x: 10,
      y: 20,
      width: 30,
      height: 40,
    });
  });

  it('normalises corners dragged up and left', () => {
    expect(getFrameFromPoints({ x: 40, y: 60 }, { x: 10, y: 20 })).toEqual({
      x: 10,
      y: 20,
      width: 30,
      height: 40,
    });
  });

  it('returns a zero-size frame for identical corners', () => {
    expect(getFrameFromPoints({ x: 10, y: 20 }, { x: 10, y: 20 })).toEqual({
      x: 10,
      y: 20,
      width: 0,
      height: 0,
    });
  });
});
