import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseParagraphElementFromMarkdown } from './parseParagraphElementFromMarkdown';
import { ParagraphElement } from './ParagraphElement.types';
import { generateBlockElement } from '../../utils';

const paragraphElement = generateBlockElement<ParagraphElement>('paragraph', {
  children: [{ text: 'Paragraph' }],
});
const consume = vi.fn();
const nextLine = vi.fn();

describe('parseParagraphElementFromMarkdown', () => {
  afterEach(() => {
    consume.mockClear();
  });

  it('parses the line into a paragraph', () => {
    expect(
      parseParagraphElementFromMarkdown('Paragraph', consume, nextLine),
    ).toEqual(paragraphElement);
  });

  it('consumes the line', () => {
    parseParagraphElementFromMarkdown('Paragraph', consume, nextLine);

    expect(consume).toHaveBeenCalledOnce();
  });
});
