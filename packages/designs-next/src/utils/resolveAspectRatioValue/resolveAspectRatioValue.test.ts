import { describe, expect, it } from 'vitest';
import { resolveAspectRatioValue } from './resolveAspectRatioValue';

describe('resolveAspectRatioValue', () => {
  it('resolves tokens to their numeric ratio', () => {
    expect(resolveAspectRatioValue('3/2')).toBe(1.5);
    expect(resolveAspectRatioValue('1/1')).toBe(1);
    expect(resolveAspectRatioValue('2/3')).toBeCloseTo(2 / 3);
  });
});
