import { MarkdownLineParser } from '../../types';
import { generateElement } from '../../utils';
import { ThematicBreakElement } from './ThematicBreakElement.types';

/**
 * Parses thematic break elements from markdown.
 *
 * @param line - The line to parse.
 * @param consume - A function to consume the line.
 * @returns A thematic break element if the line is a thematic break, otherwise null.
 */
export const parseThematicBreakElementFromMarkdown: MarkdownLineParser = (
  line,
  consume,
) => {
  // Regex to match thematic breaks
  const thematicBreakPattern = /^(-|\*|_){3,}$/;

  // Thematic breaks allow spaces around and between the characters,
  // which can be ignored by removing them.
  const match = thematicBreakPattern.exec(line.replaceAll(' ', ''));

  // If the line matches the thematic break pattern, consume the line
  // and return a thematic break element.
  if (match) {
    consume();

    return generateElement<ThematicBreakElement>('thematic-break', {
      syntax: line,
    });
  }

  // The line is not a thematic break
  return null;
};
