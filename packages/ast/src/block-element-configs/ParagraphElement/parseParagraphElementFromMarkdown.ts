import { BlockElementParser } from '../../types';
import { generateBlockElement } from '../../utils';
import { ParagraphElement } from './ParagraphElement.types';

/**
 * Parses paragraph elements. Intended to be used as a fallback parser
 * for block elements when no other block element parsers match.
 *
 * @param line - The current line to parse.
 * @param consume - A function to consume lines.
 * @returns A paragraph element.
 */
export const parseParagraphElementFromMarkdown: BlockElementParser<
  ParagraphElement
> = (line, consume) => {
  // Consume the line
  consume(1);

  return generateBlockElement<ParagraphElement>('paragraph', {
    children: [{ text: line }],
  });
};
