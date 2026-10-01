import { describe, expect, it } from 'vitest';
import { parsePdfZoom } from './parsePdfZoom';

describe('parsePdfZoom', () => {
  it('parses a fixed zoom', () => {
    expect(parsePdfZoom('1.5')).toBe(1.5);
  });

  it('keeps a fit mode as it is', () => {
    expect(parsePdfZoom('fit-page')).toBe('fit-page');
  });
});
