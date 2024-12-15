import { MarkdownLineParser } from '../../types';
import { generateElement } from '../../utils';
import { FileElement } from './FileElement.types';

/**
 * Parses embedded files in markdown syntax.
 *
 * @param line - The line to parse.
 * @param consume - A function to consume the line.
 * @returns A file or image element if the line is a match, otherwise null.
 */
export const parseFileElementFromMarkdown: MarkdownLineParser = (
  line,
  consume,
): FileElement | null => {
  // Regex for matching embedded files in markdown syntax
  const fileRegex = /^!\[(.*)\]\((.+?)(?: "(.*)")?\)$/;
  const match = line.match(fileRegex);

  // If the line is a match, consume the line and return
  // a file element.
  if (match) {
    const [, title, filename, description] = match;

    consume();

    return generateElement<FileElement>('file', {
      filename,
      title: title || filename,
      description: description || '',
      extension: filename.split('.').pop() || '',
    });
  }

  return null;
};
