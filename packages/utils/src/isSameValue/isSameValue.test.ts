import { describe, expect, it } from 'vitest';
import { isSameValue } from './isSameValue';

describe('isSameValue', () => {
  it('compares dates by their time', () => {
    expect(isSameValue(new Date('2026-01-01'), new Date('2026-01-01'))).toBe(
      true,
    );
    expect(isSameValue(new Date('2026-01-01'), new Date('2026-01-02'))).toBe(
      false,
    );
  });

  it('compares lists by their members in order', () => {
    expect(isSameValue(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(isSameValue(['a', 'b'], ['b', 'a'])).toBe(false);
    expect(isSameValue(['a'], ['a', 'b'])).toBe(false);
  });

  it('compares everything else by identity', () => {
    expect(isSameValue('a', 'a')).toBe(true);
    expect(isSameValue('a', 'b')).toBe(false);
    expect(isSameValue(null, null)).toBe(true);
    expect(isSameValue(null, undefined)).toBe(false);
  });
});
