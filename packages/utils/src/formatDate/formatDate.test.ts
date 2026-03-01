import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats a date in en-GB short format', () => {
    const date = new Date(2025, 0, 15);
    const result = formatDate(date);

    expect(result).toBe('15 Jan 2025');
  });

  it('formats a date with a two-digit day', () => {
    const date = new Date(2025, 11, 25);
    const result = formatDate(date);

    expect(result).toBe('25 Dec 2025');
  });
});
