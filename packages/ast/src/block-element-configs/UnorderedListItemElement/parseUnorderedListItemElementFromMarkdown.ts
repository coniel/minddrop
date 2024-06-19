import { BlockElementParser } from '../../types';
import { generateBlockElement } from '../../utils';
import { UnorderedListItemElement } from './UnorderedListItemElement.types';

/**
 * Parses a unordered-list-item in the GitHub flavour markdown format,
 * including checked status and nesting level.
 *
 * @param line - The line to parse.
 * @param consume - A function to consume the line.
 * @returns The parsed unordered-list-item or `null` if the line is not a unordered-list-item.
 */
export const parseUnorderedListItemElementFromMarkdown: BlockElementParser<
  UnorderedListItemElement
> = (line, consume): UnorderedListItemElement | null => {
  // Matches unordered-list-item prefix ' - '
  const ulItemRegex = /^\s*-\s/;
  // Matches leading whitespace
  const nestingRegex = /^\s*/;

  if (line.match(ulItemRegex)) {
    // Remove the unordered-list-item marker from the line
    const text = line.replace(ulItemRegex, '');
    // Determine the nesting level of the unordered-list-item.
    // This is the number of leading spaces at the beginning
    // of the line divided by 2 rounded down.
    const depth = Math.floor(nestingRegex.exec(line)![0].length / 4);

    // Consume the line
    consume();

    return generateBlockElement<UnorderedListItemElement>(
      'unordered-list-item',
      {
        depth,
        children: [{ text }],
      },
    );
  }

  return null;
};
