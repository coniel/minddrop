import { describe, expect, it } from 'vitest';
import { parseDate } from './parseDate';

describe('parseDate', () => {
  it('returns undefined for an empty string', () => {
    expect(parseDate('')).toBeUndefined();
  });

  it('returns undefined for an invalid date string', () => {
    expect(parseDate('not-a-date')).toBeUndefined();
  });

  it('parses a valid date string', () => {
    const result = parseDate('Jan 15, 2025');

    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2025);
    expect(result!.getMonth()).toBe(0);
    expect(result!.getDate()).toBe(15);
  });

  it('parses an ISO date string', () => {
    const result = parseDate('2025-06-01');

    expect(result).toBeInstanceOf(Date);
    expect(result!.getFullYear()).toBe(2025);
  });
});
