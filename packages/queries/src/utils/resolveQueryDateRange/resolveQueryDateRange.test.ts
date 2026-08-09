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
});
