import { describe, expect, it } from 'vitest';
import { getConnectionDasharray } from './getConnectionDasharray';

describe('getConnectionDasharray', () => {
  it('returns undefined for solid and unset styles', () => {
    expect(getConnectionDasharray('solid', 2)).toBeUndefined();
    expect(getConnectionDasharray(undefined, 2)).toBeUndefined();
  });

  it('scales dashes with the stroke width', () => {
    expect(getConnectionDasharray('dashed', 2)).toBe('8 6');
    expect(getConnectionDasharray('dashed', 4)).toBe('16 12');
  });

  it('scales dot spacing with the stroke width', () => {
    expect(getConnectionDasharray('dotted', 2)).toBe('0.1 5');
    expect(getConnectionDasharray('dotted', 4)).toBe('0.1 10');
  });
});
