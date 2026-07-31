import { describe, expect, it } from 'vitest';
import { formatIsoDate } from './formatIsoDate';

describe('formatIsoDate', () => {
  it('formats the local calendar date', () => {
    // Local midnight, which toISOString would shift to the
    // previous day in timezones ahead of UTC
    expect(formatIsoDate(new Date(2026, 6, 31, 0, 0))).toBe('2026-07-31');
  });

  it('pads single-digit months and days', () => {
    expect(formatIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});
