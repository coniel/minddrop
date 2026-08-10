import { describe, expect, it } from 'vitest';
import { getSideMidpoint } from './getSideMidpoint';

const frame = { x: 100, y: 200, width: 300, height: 400 };

describe('getSideMidpoint', () => {
  it('returns the top side midpoint', () => {
    expect(getSideMidpoint(frame, 'top')).toEqual({ x: 250, y: 200 });
  });

  it('returns the right side midpoint', () => {
    expect(getSideMidpoint(frame, 'right')).toEqual({ x: 400, y: 400 });
  });

  it('returns the bottom side midpoint', () => {
    expect(getSideMidpoint(frame, 'bottom')).toEqual({ x: 250, y: 600 });
  });

  it('returns the left side midpoint', () => {
    expect(getSideMidpoint(frame, 'left')).toEqual({ x: 100, y: 400 });
  });
});
