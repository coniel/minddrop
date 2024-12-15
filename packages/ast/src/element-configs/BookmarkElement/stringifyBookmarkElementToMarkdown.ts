import { BookmarkElement } from './BookmarkElement.types';

/**
 * Stringifies a bookmark element into a markdown link.
 *
 * @param element - The bookmark element to stringify.
 * @returns The markdown string.
 */
export const stringifyBookmarkElementToMarkdown = (
  element: BookmarkElement,
) => {
  const description = element.description ? ` "${element.description}"` : '';

  return `[${element.title}](${element.url}${description})`;
};
