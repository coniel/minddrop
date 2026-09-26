import { describe, expect, it } from 'vitest';
import { isFileBasedPropertyType } from './isFileBasedPropertyType';

describe('isFileBasedPropertyType', () => {
  it('returns true for a specific file type', () => {
    expect(isFileBasedPropertyType('audio')).toBe(true);
  });

  it('returns true for the catch-all file type', () => {
    expect(isFileBasedPropertyType('file')).toBe(true);
  });

  it('returns false for types without a file', () => {
    expect(isFileBasedPropertyType('text')).toBe(false);
    expect(isFileBasedPropertyType('url')).toBe(false);
  });
});
