import { describe, expect, it } from 'vitest';
import { ContentCaptureGapMs } from '../../constants';
import { resolveContentCaptureGap } from './resolveContentCaptureGap';

describe('resolveContentCaptureGap', () => {
  it('returns the base gap for ordinary entries', () => {
    expect(resolveContentCaptureGap(0)).toBe(ContentCaptureGapMs);
    expect(resolveContentCaptureGap(100_000)).toBe(ContentCaptureGapMs);
  });

  it('stretches the gap for large entries', () => {
    expect(resolveContentCaptureGap(1_000_000)).toBe(ContentCaptureGapMs * 4);
  });

  it('stretches the gap furthest for the largest entries', () => {
    expect(resolveContentCaptureGap(10_000_000)).toBe(ContentCaptureGapMs * 12);
  });
});
