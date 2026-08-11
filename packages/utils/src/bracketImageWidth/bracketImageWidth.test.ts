import { describe, expect, it } from 'vitest';
import { IMAGE_WIDTH_BRACKET, MAX_IMAGE_RESIZE_WIDTH } from '../constants';
import { bracketImageWidth } from './bracketImageWidth';

describe('bracketImageWidth', () => {
  it('rounds up to the nearest bracket', () => {
    expect(bracketImageWidth(748)).toBe(800);
    expect(bracketImageWidth(801)).toBe(1000);
  });

  it('leaves exact bracket multiples unchanged', () => {
    expect(bracketImageWidth(800)).toBe(800);
  });

  it('clamps to a minimum of one bracket', () => {
    expect(bracketImageWidth(1)).toBe(IMAGE_WIDTH_BRACKET);
  });

  it('returns null above the resize cap', () => {
    expect(bracketImageWidth(MAX_IMAGE_RESIZE_WIDTH)).toBe(
      MAX_IMAGE_RESIZE_WIDTH,
    );
    expect(bracketImageWidth(MAX_IMAGE_RESIZE_WIDTH + 1)).toBeNull();
  });

  it('returns null for invalid widths', () => {
    expect(bracketImageWidth(0)).toBeNull();
    expect(bracketImageWidth(-100)).toBeNull();
    expect(bracketImageWidth(Number.NaN)).toBeNull();
  });
});
