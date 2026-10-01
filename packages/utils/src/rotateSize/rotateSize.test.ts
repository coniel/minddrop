import { describe, expect, it } from 'vitest';
import { rotateSize } from './rotateSize';

// A portrait size
const size = { width: 100, height: 200 };

describe('rotateSize', () => {
  it('swaps the width and height for a sideways rotation', () => {
    expect(rotateSize(size, 90)).toEqual({ width: 200, height: 100 });
    expect(rotateSize(size, 270)).toEqual({ width: 200, height: 100 });
  });

  it('keeps the size for an upright rotation', () => {
    expect(rotateSize(size, 0)).toBe(size);
    expect(rotateSize(size, 180)).toBe(size);
  });
});
