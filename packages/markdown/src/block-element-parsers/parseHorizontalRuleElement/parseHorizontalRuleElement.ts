import { HorizontalRuleElement } from '@minddrop/editor';
import { BlockElementParser } from '../../types';

/**
 * Parses horizontal rule elements.
 *
 * @param line - The line to parse.
 * @param consume - A function to consume the line.
 * @returns A horizontal rule element if the line is a horizontal rule, otherwise null.
 */
export const parseHorizontalRuleElement: BlockElementParser = (
  line,
  consume,
): HorizontalRuleElement | null => {
  // Regex to match horizontal rules
  const horizontalRulePattern = /^(\-|\*|\_){3,}$/;

  // Markdown horizontal rules allow spaces around and between
  // the characters which can be ignored by removing them.
  const match = horizontalRulePattern.exec(line.replaceAll(' ', ''));

  // If the line matches the horizontal rule pattern, consume
  // the line and return a horizontal rule element.
  if (match) {
    consume();

    return {
      type: 'horizontal-rule',
      level: 'block',
      markdown: line,
      children: [{ text: '' }],
    };
  }

  // The line is not a horizontal rule
  return null;
};
