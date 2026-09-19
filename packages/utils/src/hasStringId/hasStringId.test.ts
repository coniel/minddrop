import { describe, expect, it } from 'vitest';
import { hasStringId } from './hasStringId';

describe('hasStringId', () => {
  it('is true for an object with a string ID', () => {
    expect(hasStringId({ id: 'a' })).toBe(true);
  });

  it('is false for an object without one', () => {
    expect(hasStringId({ id: 1 })).toBe(false);
    expect(hasStringId({})).toBe(false);
  });

  it('is false for anything but an object', () => {
    expect(hasStringId('a')).toBe(false);
    expect(hasStringId(null)).toBe(false);
  });
});
