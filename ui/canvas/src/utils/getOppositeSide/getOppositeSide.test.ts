import { describe, expect, it } from 'vitest';
import { getOppositeSide } from './getOppositeSide';

describe('getOppositeSide', () => {
  it('flips the vertical sides', () => {
    expect(getOppositeSide('top')).toBe('bottom');
    expect(getOppositeSide('bottom')).toBe('top');
  });

  it('flips the horizontal sides', () => {
    expect(getOppositeSide('left')).toBe('right');
    expect(getOppositeSide('right')).toBe('left');
  });
});
