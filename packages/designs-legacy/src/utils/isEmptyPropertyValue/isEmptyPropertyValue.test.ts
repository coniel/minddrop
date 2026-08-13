import { describe, expect, it } from 'vitest';
import { isEmptyPropertyValue } from './isEmptyPropertyValue';

describe('isEmptyPropertyValue', () => {
  it('treats null and undefined as empty', () => {
    expect(isEmptyPropertyValue(null)).toBe(true);
    expect(isEmptyPropertyValue(undefined)).toBe(true);
  });

  it('treats an empty string as empty', () => {
    expect(isEmptyPropertyValue('')).toBe(true);
  });

  it('treats an empty array as empty', () => {
    expect(isEmptyPropertyValue([])).toBe(true);
  });

  it('treats non-empty values as not empty', () => {
    expect(isEmptyPropertyValue('text')).toBe(false);
    expect(isEmptyPropertyValue(['a'])).toBe(false);
    expect(isEmptyPropertyValue(42)).toBe(false);
  });

  it('treats zero and false as values, not empty', () => {
    expect(isEmptyPropertyValue(0)).toBe(false);
    expect(isEmptyPropertyValue(false)).toBe(false);
  });
});
