import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats the medium style by default', () => {
    const date = new Date(2025, 0, 15);
    const result = formatDate(date);

    expect(result).toBe('15 Jan 2025');
  });

  it('formats a date with a two-digit day', () => {
    const date = new Date(2025, 11, 25);
    const result = formatDate(date);

    expect(result).toBe('25 Dec 2025');
  });

  it('formats the compact style as numbers with a two-digit year', () => {
    expect(formatDate(new Date(2025, 0, 5), { style: 'compact' })).toBe(
      '05/01/25',
    );
  });

  it('formats the short style as numbers', () => {
    expect(formatDate(new Date(2025, 0, 5), { style: 'short' })).toBe(
      '05/01/2025',
    );
  });

  it('formats the long style with the month spelled out', () => {
    expect(formatDate(new Date(2025, 0, 15), { style: 'long' })).toBe(
      '15 January 2025',
    );
  });

  it('formats the full style with the weekday', () => {
    expect(formatDate(new Date(2025, 0, 15), { style: 'full' })).toBe(
      'Wed, 15 Jan 2025',
    );
  });

  it('follows the date with the time when set to', () => {
    expect(formatDate(new Date(2025, 0, 15, 14, 30), { time: true })).toBe(
      '15 Jan 2025, 14:30',
    );
  });
});
