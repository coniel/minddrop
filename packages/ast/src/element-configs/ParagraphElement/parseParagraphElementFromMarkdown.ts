import { parseInlineMarkdown } from '../../parseInlineMarkdown';
import { MarkdownLineParser } from '../../types';
import { generateElement } from '../../utils';
import { ParagraphElement } from './ParagraphElement.types';

/**
 * Parses paragraph elements. Intended to be used as a fallback parser
 * for elements when no other element parsers match.
 *
 * @param line - The current line to parse.
 * @param consume - A function to consume lines.
 * @returns A paragraph element.
 */
export const parseParagraphElementFromMarkdown: MarkdownLineParser = (
  line,
  consume,
) => {
  // Consume the line
  consume(1);

  return generateElement<ParagraphElement>('paragraph', {
    children: parseInlineMarkdown(line),
  });
};
