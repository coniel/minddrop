import { describe, expect, it } from 'vitest';
import { resizeMovesAxis } from './resizeMovesAxis';

describe('resizeMovesAxis', () => {
  it('moves along x for the side edges and corners', () => {
    expect(resizeMovesAxis('left', 'x')).toBe(true);
    expect(resizeMovesAxis('right', 'x')).toBe(true);
    expect(resizeMovesAxis('top-left', 'x')).toBe(true);
    expect(resizeMovesAxis('bottom-right', 'x')).toBe(true);
  });

  it('does not move along x for the bottom edge', () => {
    expect(resizeMovesAxis('bottom', 'x')).toBe(false);
  });

  it('moves along y for the bottom edge and corners', () => {
    expect(resizeMovesAxis('bottom', 'y')).toBe(true);
    expect(resizeMovesAxis('top-left', 'y')).toBe(true);
    expect(resizeMovesAxis('bottom-right', 'y')).toBe(true);
  });

  it('does not move along y for the side edges', () => {
    expect(resizeMovesAxis('left', 'y')).toBe(false);
    expect(resizeMovesAxis('right', 'y')).toBe(false);
  });
});
