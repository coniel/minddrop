import { describe, expect, it } from 'vitest';
import { isSerializedDate } from './isSerializedDate';

describe('isSerializedDate', () => {
  it('should return true for valid ISO 8601 date strings', () => {
    expect(isSerializedDate('2024-12-06T15:00:00.000Z')).toBe(true);
    expect(isSerializedDate('2000-01-01T00:00:00.000Z')).toBe(true);
    expect(isSerializedDate('1999-12-31T23:59:59.999Z')).toBe(true);
  });

  it('should return false for non-date strings', () => {
    expect(isSerializedDate('not-a-date')).toBe(false);
    expect(isSerializedDate('12345')).toBe(false);
    expect(isSerializedDate('abcd-ef-ghTij:kl:mn.000Z')).toBe(false);
  });

  it('should return false for strings with invalid ISO 8601 format', () => {
    expect(isSerializedDate('2024-12-06')).toBe(false); // Missing time
    expect(isSerializedDate('2024-12-06T15:00')).toBe(false); // Missing seconds
    expect(isSerializedDate('2024-12-06T15:00:00Z')).toBe(true); // Valid ISO 8601 without milliseconds
  });

  it('should return false for invalid date strings', () => {
    expect(isSerializedDate('2024-13-06T15:00:00.000Z')).toBe(false); // Invalid month
    expect(isSerializedDate('2024-12-32T15:00:00.000Z')).toBe(false); // Invalid day
    expect(isSerializedDate('2024-12-06T25:00:00.000Z')).toBe(false); // Invalid hour
    expect(isSerializedDate('2024-12-06T15:61:00.000Z')).toBe(false); // Invalid minute
    expect(isSerializedDate('2024-12-06T15:00:61.000Z')).toBe(false); // Invalid second
  });

  it('should return false for non-string inputs', () => {
    expect(isSerializedDate(12345)).toBe(false);
    expect(isSerializedDate(null)).toBe(false);
    expect(isSerializedDate(undefined)).toBe(false);
    expect(isSerializedDate({})).toBe(false);
  });
});
