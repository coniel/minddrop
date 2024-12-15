import { MarkdownLineParser } from '../../types';
import { generateElement } from '../../utils';
import { HorizontalRuleElement } from './HorizontalRuleElement.types';

/**
 * Parses horizontal rule elements from markdown.
 *
 * @param line - The line to parse.
 * @param consume - A function to consume the line.
 * @returns A horizontal rule element if the line is a horizontal rule, otherwise null.
 */
export const parseHorizontalRuleElementFromMarkdown: MarkdownLineParser = (
  line,
  consume,
) => {
  // Regex to match horizontal rules
  const horizontalRulePattern = /^(-|\*|_){3,}$/;

  //  horizontal rules allow spaces around and between
  // the characters which can be ignored by removing them.
  const match = horizontalRulePattern.exec(line.replaceAll(' ', ''));

  // If the line matches the horizontal rule pattern, consume
  // the line and return a horizontal rule element.
  if (match) {
    consume();

    return generateElement<HorizontalRuleElement>('horizontal-rule', {
      markdown: line,
    });
  }

  // The line is not a horizontal rule
  return null;
};
