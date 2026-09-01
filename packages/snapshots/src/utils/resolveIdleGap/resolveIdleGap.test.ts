import { describe, expect, it } from 'vitest';
import { IdleGapMs } from '../../constants';
import { resolveIdleGap } from './resolveIdleGap';

describe('resolveIdleGap', () => {
  it('returns the base gap for ordinary subjects', () => {
    expect(resolveIdleGap(0)).toBe(IdleGapMs);
    expect(resolveIdleGap(100_000)).toBe(IdleGapMs);
  });

  it('stretches the gap for large subjects', () => {
    expect(resolveIdleGap(1_000_000)).toBe(IdleGapMs * 4);
  });

  it('stretches the gap furthest for the largest subjects', () => {
    expect(resolveIdleGap(10_000_000)).toBe(IdleGapMs * 12);
  });
});
