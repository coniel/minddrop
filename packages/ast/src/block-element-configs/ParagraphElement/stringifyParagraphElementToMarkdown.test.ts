import { describe, it, expect } from 'vitest';
import { stringifyParagraphElementToMarkdown } from './stringifyParagraphElementToMarkdown';
import { ParagraphElement } from './ParagraphElement.types';
import { generateBlockElement } from '../../utils';

const paragraph = generateBlockElement<ParagraphElement>('paragraph', {
  children: [{ text: 'Paragraph 1' }],
});

describe('stringifyParagraphElementToMarkdown', () => {
  it('stringifies the paragraph element children', () => {
    expect(stringifyParagraphElementToMarkdown(paragraph)).toBe('Paragraph 1');
  });
});
