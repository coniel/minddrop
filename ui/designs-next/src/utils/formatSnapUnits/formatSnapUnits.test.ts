import { describe, expect, it } from 'vitest';
import { formatSnapUnits } from './formatSnapUnits';

describe('formatSnapUnits', () => {
  it('counts the snap units a span covers', () => {
    expect(formatSnapUnits(8, 4)).toBe('2');
  });

  it('rounds a span landing between squares to a tenth', () => {
    expect(formatSnapUnits(7, 4)).toBe('1.8');
  });

  it('leaves whole counts without a decimal', () => {
    expect(formatSnapUnits(6, 2)).toBe('3');
  });
});
