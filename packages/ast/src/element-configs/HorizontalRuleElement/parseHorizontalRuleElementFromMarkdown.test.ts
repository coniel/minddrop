import { describe, afterEach, it, expect, vi } from 'vitest';
import { generateElement } from '../../utils';
import { parseHorizontalRuleElementFromMarkdown } from './parseHorizontalRuleElementFromMarkdown';
import { HorizontalRuleElement } from './HorizontalRuleElement.types';

const consume = vi.fn();
const getNextLine = vi.fn();

const horizontalRuleElement = generateElement<HorizontalRuleElement>(
  'horizontal-rule',
  {
    markdown: '---',
  },
);

const horizontalRules = [
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

describe('parseHorizontalRuleElementFromMarkdown', () => {
  afterEach(() => {
    consume.mockReset();
  });

  it('parses horizontal rule', () => {
    horizontalRules.forEach((line) => {
      expect(
        parseHorizontalRuleElementFromMarkdown(line, consume, getNextLine),
      ).toEqual({
        ...horizontalRuleElement,
        markdown: line,
      });
    });
  });

  it('does not match horizontal rule with less than 3 characters', () => {
    const line = '--';

    expect(
      parseHorizontalRuleElementFromMarkdown(line, consume, getNextLine),
    ).toBeNull();
  });

  it('does not match if the line contains other characters', () => {
    const lines = ['foo---', '---foo---', '---foo'];

    lines.forEach((line) => {
      expect(
        parseHorizontalRuleElementFromMarkdown(line, consume, getNextLine),
      ).toBeNull();
    });
  });

  it('consumes the line', () => {
    const line = '---';

    parseHorizontalRuleElementFromMarkdown(line, consume, getNextLine);

    expect(consume).toHaveBeenCalledOnce();
  });

  it('returns null if the line does not match the horizontal rule pattern', () => {
    const line = 'foo';

    expect(
      parseHorizontalRuleElementFromMarkdown(line, consume, getNextLine),
    ).toBeNull();
  });
});
