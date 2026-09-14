import { describe, expect, it } from 'vitest';
import { resolveRelativeDate } from './resolveRelativeDate';

// Reference date: mid-afternoon local time
const now = new Date(2026, 5, 15, 15, 30, 0);

describe('resolveRelativeDate', () => {
  it('resolves today to the start of the current day', () => {
    expect(resolveRelativeDate('today', now)).toEqual(new Date(2026, 5, 15));
  });

  it('resolves yesterday and tomorrow', () => {
    expect(resolveRelativeDate('yesterday', now)).toEqual(
      new Date(2026, 5, 14),
    );
    expect(resolveRelativeDate('tomorrow', now)).toEqual(new Date(2026, 5, 16));
  });

  it('resolves week offsets', () => {
    expect(resolveRelativeDate('one-week-ago', now)).toEqual(
      new Date(2026, 5, 8),
    );
    expect(resolveRelativeDate('one-week-from-now', now)).toEqual(
      new Date(2026, 5, 22),
    );
  });

  it('resolves month offsets', () => {
    expect(resolveRelativeDate('one-month-ago', now)).toEqual(
      new Date(2026, 4, 15),
    );
    expect(resolveRelativeDate('one-month-from-now', now)).toEqual(
      new Date(2026, 6, 15),
    );
  });
});
