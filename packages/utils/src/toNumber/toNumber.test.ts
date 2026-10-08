import { describe, expect, it } from 'vitest';
import { toNumber } from './toNumber';

describe('toNumber', () => {
  it('returns a number as it is', () => {
    expect(toNumber(1234.5)).toBe(1234.5);
  });

  it('parses a serialized number', () => {
    expect(toNumber('1234.5')).toBe(1234.5);
  });

  it('returns undefined for text which is not a number', () => {
    expect(toNumber('many')).toBeUndefined();
  });

  it('returns undefined for a blank string', () => {
    expect(toNumber('')).toBeUndefined();
    expect(toNumber(' ')).toBeUndefined();
  });

  it('returns undefined for a number which is not finite', () => {
    expect(toNumber(Infinity)).toBeUndefined();
    expect(toNumber(NaN)).toBeUndefined();
  });

  it('returns undefined for a value of another type', () => {
    expect(toNumber(null)).toBeUndefined();
    expect(toNumber(true)).toBeUndefined();
    expect(toNumber(new Date())).toBeUndefined();
  });
});
