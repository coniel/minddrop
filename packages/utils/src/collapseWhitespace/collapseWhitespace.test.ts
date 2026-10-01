import { describe, expect, it } from 'vitest';
import { collapseWhitespace } from './collapseWhitespace';

describe('collapseWhitespace', () => {
  it('collapses whitespace runs and line breaks to one space', () => {
    expect(collapseWhitespace('A line\nof  text\r\n  wraps')).toBe(
      'A line of text wraps',
    );
  });

  it('trims the ends', () => {
    expect(collapseWhitespace('  padded  ')).toBe('padded');
  });
});
