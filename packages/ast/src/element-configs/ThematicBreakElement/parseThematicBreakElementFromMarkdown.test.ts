import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateElement } from '../../utils';
import { ThematicBreakElement } from './ThematicBreakElement.types';
import { parseThematicBreakElementFromMarkdown } from './parseThematicBreakElementFromMarkdown';

const consume = vi.fn();
const getNextLine = vi.fn();

const thematicBreakElement = generateElement<ThematicBreakElement>(
  'thematic-break',
  {
    syntax: '---',
  },
);

const thematicBreaks = [
  '---',
  '***',
  '___',
  '--------',
  '*******',
  '_________',
  ' - - - ',
  ' * * * ',
  ' _ _ _ ',
];

describe('parseThematicBreakElementFromMarkdown', () => {
  afterEach(() => {
    consume.mockReset();
  });

  it('parses thematic breaks', () => {
    thematicBreaks.forEach((line) => {
      expect(
        parseThematicBreakElementFromMarkdown(line, consume, getNextLine),
      ).toEqual({
        ...thematicBreakElement,
        syntax: line,
      });
    });
  });

  it('does not match a thematic break with less than 3 characters', () => {
    const line = '--';

    expect(
      parseThematicBreakElementFromMarkdown(line, consume, getNextLine),
    ).toBeNull();
  });

  it('does not match if the line contains other characters', () => {
    const lines = ['foo---', '---foo---', '---foo'];

    lines.forEach((line) => {
      expect(
        parseThematicBreakElementFromMarkdown(line, consume, getNextLine),
      ).toBeNull();
    });
  });

  it('consumes the line', () => {
    const line = '---';

    parseThematicBreakElementFromMarkdown(line, consume, getNextLine);

    expect(consume).toHaveBeenCalledOnce();
  });

  it('returns null if the line does not match the thematic break pattern', () => {
    const line = 'foo';

    expect(
      parseThematicBreakElementFromMarkdown(line, consume, getNextLine),
    ).toBeNull();
  });
});
