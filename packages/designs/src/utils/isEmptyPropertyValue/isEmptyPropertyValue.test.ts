import { describe, expect, it } from 'vitest';
import { isEmptyPropertyValue } from './isEmptyPropertyValue';

describe('isEmptyPropertyValue', () => {
  it('treats missing values as empty', () => {
    expect(isEmptyPropertyValue(undefined)).toBe(true);
    expect(isEmptyPropertyValue(null)).toBe(true);
  });

  it('treats empty strings and arrays as empty', () => {
    expect(isEmptyPropertyValue('')).toBe(true);
    expect(isEmptyPropertyValue([])).toBe(true);
  });

  it('treats zero and false as values', () => {
    expect(isEmptyPropertyValue(0)).toBe(false);
    expect(isEmptyPropertyValue(false)).toBe(false);
  });

  it('treats non-empty values as values', () => {
    expect(isEmptyPropertyValue('text')).toBe(false);
    expect(isEmptyPropertyValue(['a'])).toBe(false);
  });
});
