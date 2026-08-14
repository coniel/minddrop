import { stringifyFragmentToMarkdown } from '../../stringifyFragmentToMarkdown';
import { LinkElement } from './LinkElement.types';

/**
 * Stringifies a link element into markdown.
 *
 * @param element - The link element to stringify.
 * @returns A markdown link string.
 */
export const stringifyLinkElementToMarkdown = (
  element: LinkElement,
): string => {
  // Autolinks carry no separate text, the destination is the text
  if (element.autolink) {
    return `<${element.url}>`;
  }

  const text = stringifyFragmentToMarkdown(element.children);

  // The title is optional and follows the destination
  if (element.title) {
    return `[${text}](${element.url} "${element.title}")`;
  }

  return `[${text}](${element.url})`;
};
