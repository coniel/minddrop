import { describe, expect, it } from 'vitest';
import { ContentPropertySchema, TextPropertySchema } from '../../schemas';
import { isContentProperty } from './isContentProperty';

describe('isContentProperty', () => {
  it('returns true for a content property', () => {
    expect(
      isContentProperty({ ...ContentPropertySchema, name: 'Content' }),
    ).toBe(true);
  });

  it('returns false for a property of another type', () => {
    expect(isContentProperty({ ...TextPropertySchema, name: 'Text' })).toBe(
      false,
    );
  });
});
