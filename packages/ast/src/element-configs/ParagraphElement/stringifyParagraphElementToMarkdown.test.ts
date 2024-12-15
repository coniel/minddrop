import { describe, expect, it } from 'vitest';
import { generateElement } from '../../utils';
import { ParagraphElement } from './ParagraphElement.types';
import { stringifyParagraphElementToMarkdown } from './stringifyParagraphElementToMarkdown';

const paragraph = generateElement<ParagraphElement>('paragraph', {
  children: [{ text: 'Paragraph 1' }],
});

describe('stringifyParagraphElementToMarkdown', () => {
  it('stringifies the paragraph element children', () => {
    expect(stringifyParagraphElementToMarkdown(paragraph)).toBe('Paragraph 1');
  });
});
