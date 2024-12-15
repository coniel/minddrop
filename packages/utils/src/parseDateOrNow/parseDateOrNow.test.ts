import { describe, expect, it, vi } from 'vitest';
import { parseDateOrNow } from './parseDateOrNow';

describe('parseDateOrNow', () => {
  it('should return a valid Date object for a valid date string', () => {
    const result = parseDateOrNow('2024-11-30');
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe('2024-11-30T00:00:00.000Z');
  });

  it('should return the current date for an invalid date string', () => {
    const mockDate = new Date('2024-11-30T12:00:00Z');
    vi.setSystemTime(mockDate);

    const result = parseDateOrNow('invalid-date');
    expect(result.toISOString()).toBe(mockDate.toISOString());

    vi.useRealTimers();
  });

  it('should return the current date for undefined input', () => {
    const mockDate = new Date('2024-11-30T12:00:00Z');
    vi.setSystemTime(mockDate);

    // @ts-expect-error - Testing undefined input
    const result = parseDateOrNow(undefined);
    expect(result.toISOString()).toBe(mockDate.toISOString());

    vi.useRealTimers();
  });

  it('should return the current date for null input', () => {
    const mockDate = new Date('2024-11-30T12:00:00Z');
    vi.setSystemTime(mockDate);

    // @ts-expect-error - Testing null
    const result = parseDateOrNow(null);
    expect(result.toISOString()).toBe(mockDate.toISOString());

    vi.useRealTimers();
  });
});
