import { describe, expect, it } from 'vitest';
import { resolveQueryDateRange } from './resolveQueryDateRange';

const now = new Date(2026, 5, 15, 15, 30, 0);

describe('resolveQueryDateRange', () => {
  it('resolves an absolute date to its local day range', () => {
    const result = resolveQueryDateRange({
      type: 'absolute',
      date: new Date(2026, 5, 10, 12, 0, 0),
    });

    expect(result.start).toBe(new Date(2026, 5, 10).getTime());
    expect(result.end).toBe(new Date(2026, 5, 11).getTime());
  });

  it('resolves a relative preset to its local day range', () => {
    const result = resolveQueryDateRange(
      { type: 'relative', preset: 'yesterday' },
      now,
    );

    expect(result.start).toBe(new Date(2026, 5, 14).getTime());
    expect(result.end).toBe(new Date(2026, 5, 15).getTime());
  });

  it('resolves a past relative range including the current day', () => {
    const result = resolveQueryDateRange(
      { type: 'relative-range', days: 7, direction: 'past' },
      now,
    );

    // Seven days counting back from June 15 start on June 9
    expect(result.start).toBe(new Date(2026, 5, 9).getTime());
    expect(result.end).toBe(new Date(2026, 5, 16).getTime());
  });

  it('resolves a future relative range including the current day', () => {
    const result = resolveQueryDateRange(
      { type: 'relative-range', days: 7, direction: 'next' },
      now,
    );

    // Seven days counting forward from June 15 end on June 21
    expect(result.start).toBe(new Date(2026, 5, 15).getTime());
    expect(result.end).toBe(new Date(2026, 5, 22).getTime());
  });

  it('clamps relative range day counts to at least one day', () => {
    const result = resolveQueryDateRange(
      { type: 'relative-range', days: 0, direction: 'past' },
      now,
    );

    // A zero day count still covers the current day
    expect(result.start).toBe(new Date(2026, 5, 15).getTime());
    expect(result.end).toBe(new Date(2026, 5, 16).getTime());
  });
});
