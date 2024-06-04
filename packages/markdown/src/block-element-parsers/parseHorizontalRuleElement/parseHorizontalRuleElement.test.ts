import { describe, afterEach, it, expect, vi } from 'vitest';
import { HorizontalRuleElement } from '@minddrop/editor';
import { parseHorizontalRuleElement } from './parseHorizontalRuleElement';

const consume = vi.fn();
const getNextLine = vi.fn();

const horizontalRuleElement: HorizontalRuleElement = {
  type: 'horizontal-rule',
  level: 'block',
  markdown: '---',
  children: [{ text: '' }],
};

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

describe('parseHorizontalRuleElement', () => {
  afterEach(() => {
    consume.mockReset();
  });

  it('parses horizontal rule', () => {
    horizontalRules.forEach((line) => {
      expect(parseHorizontalRuleElement(line, consume, getNextLine)).toEqual({
        ...horizontalRuleElement,
        markdown: line,
      });
    });
  });

  it('does not match horizontal rule with less than 3 characters', () => {
    const line = '--';

    expect(parseHorizontalRuleElement(line, consume, getNextLine)).toBeNull();
  });

  it('does not match if the line contains other characters', () => {
    const lines = ['foo---', '---foo---', '---foo'];

    lines.forEach((line) => {
      expect(parseHorizontalRuleElement(line, consume, getNextLine)).toBeNull();
    });
  });

  it('consumes the line', () => {
    const line = '---';

    parseHorizontalRuleElement(line, consume, getNextLine);

    expect(consume).toHaveBeenCalledOnce();
  });

  it('returns null if the line does not match the horizontal rule pattern', () => {
    const line = 'foo';

    expect(parseHorizontalRuleElement(line, consume, getNextLine)).toBeNull();
  });
});
