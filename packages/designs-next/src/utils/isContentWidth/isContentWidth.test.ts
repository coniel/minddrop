import { describe, expect, it } from 'vitest';
import { ContentWidths } from '../../constants';
import { isContentWidth } from './isContentWidth';

describe('isContentWidth', () => {
  it('accepts every content width', () => {
    ContentWidths.forEach((width) => {
      expect(isContentWidth(width)).toBe(true);
    });
  });

  it('rejects other strings and non-strings', () => {
    expect(isContentWidth('full')).toBe(false);
    expect(isContentWidth(120)).toBe(false);
    expect(isContentWidth(undefined)).toBe(false);
  });
});
