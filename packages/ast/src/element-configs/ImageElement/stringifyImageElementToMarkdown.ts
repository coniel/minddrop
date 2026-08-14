import { ImageElement } from './ImageElement.types';

/**
 * Stringifies an image element into markdown.
 *
 * @param element - The image element to stringify.
 * @returns A markdown image string.
 */
export const stringifyImageElementToMarkdown = (
  element: ImageElement,
): string => {
  const image = `![${element.alt || ''}](${element.url}`;

  // The title is optional and follows the source
  if (element.title) {
    return `${image} "${element.title}")`;
  }

  return `${image})`;
};
