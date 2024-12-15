import { MarkdownLineParser } from '../../types';
import { generateElement } from '../../utils';
import { BookmarkElement } from './BookmarkElement.types';

/**
 * Parses bookmark elements including the title, url, and
 * optional description.
 *
 * @param line - The line to parse.
 * @param consume - A function to consume lines.
 * @returns A bookmark element if the line is a bookmark, otherwise null.
 */
export const parseBookmarkElementFromMarkdown: MarkdownLineParser = (
  line,
  consume,
): BookmarkElement | null => {
  // Regex to match a markdown link alone on a line,
  // extracting the title, url, and optional description.
  const bookmarkRegex = /^\[(.*)\]\((.+?)(?: "(.*)")?\)$/;

  // Check if the line matches the bookmark regex
  const match = line.match(bookmarkRegex);

  // If it matches and the title and url are present,
  // consume the line and return a bookmark element.
  if (match && match[1] && match[2]) {
    consume();

    return generateElement<BookmarkElement>('bookmark', {
      title: match[1],
      url: match[2],
      description: match[3] || '',
    });
  }

  // Line is not a bookmark
  return null;
};
