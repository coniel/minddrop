import { describe, expect, it } from 'vitest';
import { resolveTextLineRowSpan } from './resolveTextLineRowSpan';

describe('resolveTextLineRowSpan', () => {
  it('rounds the line height up to whole units', () => {
    // 14px at 1.4 is 19.6px, which needs five 4px units
    expect(resolveTextLineRowSpan(14)).toBe(5);
  });

  it('keeps a line height already on whole units', () => {
    // 20px at 1.4 is 28px, exactly seven units
    expect(resolveTextLineRowSpan(20)).toBe(7);
  });
});
