import { describe, expect, it } from 'vitest';
import { getSideNormal } from './getSideNormal';

describe('getSideNormal', () => {
  it('returns the outward normal of each side', () => {
    expect(getSideNormal('top')).toEqual({ x: 0, y: -1 });
    expect(getSideNormal('right')).toEqual({ x: 1, y: 0 });
    expect(getSideNormal('bottom')).toEqual({ x: 0, y: 1 });
    expect(getSideNormal('left')).toEqual({ x: -1, y: 0 });
  });
});
