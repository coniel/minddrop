import { BookmarkElement } from '@minddrop/editor';
import { BlockElementParser } from '../../types';

/**
 * Parses bookmark elements including the title, url, and
 * optional description.
 *
 * @param line - The line to parse.
 * @param consume - A function to consume lines.
 * @returns A bookmark element if the line is a bookmark, otherwise null.
 */
export const parseBookmarkElement: BlockElementParser = (
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

    return {
      type: 'bookmark',
      level: 'block',
      title: match[1],
      url: match[2],
      description: match[3] || '',
      children: [{ text: '' }],
    };
  }

  // Line is not a bookmark
  return null;
};
