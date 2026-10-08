import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatDateInMode } from './formatDateInMode';

describe('formatDateInMode', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats the date itself by default', () => {
    expect(formatDateInMode(new Date(2025, 0, 15))).toBe('15 Jan 2025');
  });

  // The long style's join with the time is the platform's, which has
  // changed between ICU releases.
  it('formats the date itself at the length and with the time set', () => {
    expect(
      formatDateInMode(new Date(2025, 0, 15, 14, 30), {
        style: 'long',
        time: true,
      }),
    ).toBe('15 January 2025 at 14:30');
  });

  it('formats the date relative to now in the relative mode, ignoring the length and time', () => {
    // Pin the clock to two days after the date
    vi.setSystemTime(new Date(2025, 0, 17));

    expect(
      formatDateInMode(new Date(2025, 0, 15), {
        mode: 'relative',
        style: 'long',
        time: true,
      }),
    ).toBe('2 days ago');
  });
});
