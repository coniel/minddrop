import { describe, expect, it } from 'vitest';
import { stringifyPdfZoom } from './stringifyPdfZoom';

describe('stringifyPdfZoom', () => {
  it('stringifies a fixed zoom', () => {
    expect(stringifyPdfZoom(1.5)).toBe('1.5');
  });

  it('keeps a fit mode as it is', () => {
    expect(stringifyPdfZoom('fit-width')).toBe('fit-width');
  });
});
