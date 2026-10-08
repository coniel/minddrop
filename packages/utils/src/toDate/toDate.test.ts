import { describe, expect, it } from 'vitest';
import { toDate } from './toDate';

describe('toDate', () => {
  it('returns a date as it is', () => {
    const date = new Date(2025, 0, 15);

    expect(toDate(date)).toBe(date);
  });

  it('parses a serialized date', () => {
    expect(toDate('2025-01-15T00:00:00.000Z')).toEqual(
      new Date('2025-01-15T00:00:00.000Z'),
    );
  });

  it('returns undefined for text which is not a date', () => {
    expect(toDate('soon')).toBeUndefined();
  });

  it('returns undefined for an empty value', () => {
    expect(toDate(null)).toBeUndefined();
    expect(toDate(undefined)).toBeUndefined();
    expect(toDate('')).toBeUndefined();
  });

  it('returns undefined for a value of another type', () => {
    expect(toDate(42)).toBeUndefined();
    expect(toDate(true)).toBeUndefined();
  });
});
