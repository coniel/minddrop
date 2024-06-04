import { BlockElement } from '@minddrop/editor';
import { BlockElementParser } from '../../types/BlockElementParser.types';

/**
 * Parses heading elements from level 1 to 6, including the alternative
 * syntax of heading 1 and 2.
 *
 * @param line - The current line to parse.
 * @param consume - A function to consume lines.
 * @param getNextLine - A function to get the next line.
 * @returns A heading element if the line is a heading, otherwise null.
 */
export const parseHeadingElement: BlockElementParser = (
  line,
  consume,
  getNextLine,
): BlockElement | null => {
  // Matches lines that start with 1 to 6 hash symbols followed
  // by a whitespace.
  const headingRegex = /^(#{1,6}\s*)/;
  const match = line.match(headingRegex);

  if (match) {
    // Extract the level of the heading
    const level = match[0].length - 1;
    // Extract the text of the heading
    const text = line.replace(/^#+ /, '');

    // Consume the line
    consume();

    return {
      type: `heading-${level}`,
      level: 'block',
      children: [{ text }],
    };
  }

  const nextLine = getNextLine();

  // Matches the alternative heading 1 or 2 syntax which is a heading
  // followed by a line of equal signs or dashes respectively.
  if (nextLine && nextLine.match(/^(=+|-+)$/)) {
    const headingLevel = nextLine[0] === '=' ? 1 : 2;

    // Consume both the heading and the line of equal signs or dashes
    consume(2);

    return {
      type: `heading-${headingLevel}`,
      level: 'block',
      children: [{ text: line }],
    };
  }

  // Line is not a heading
  return null;
};
