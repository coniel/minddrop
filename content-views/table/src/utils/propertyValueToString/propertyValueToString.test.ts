import { describe, expect, it } from 'vitest';
import { propertyValueToString } from './propertyValueToString';

describe('propertyValueToString', () => {
  it('returns an empty string for null', () => {
    expect(propertyValueToString(null)).toBe('');
  });

  it('returns an empty string for undefined', () => {
    expect(propertyValueToString(undefined)).toBe('');
  });

  it('formats a Date object', () => {
    const date = new Date(2025, 0, 15);
    const result = propertyValueToString(date);

    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2025');
  });

  it('joins array values with commas', () => {
    expect(propertyValueToString(['a', 'b', 'c'])).toBe('a, b, c');
  });

  it('converts a number to a string', () => {
    expect(propertyValueToString(42)).toBe('42');
  });

  it('returns a string value as-is', () => {
    expect(propertyValueToString('hello')).toBe('hello');
  });
});
