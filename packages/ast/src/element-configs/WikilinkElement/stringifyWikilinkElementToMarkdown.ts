import { getLiteralContent } from '../../utils';
import { WikilinkElement } from './WikilinkElement.types';

/**
 * Stringifies a wikilink element into its markdown spelling.
 *
 * A link whose text is its own reference is written without a label, which
 * is the spelling it was read from.
 *
 * @param element - The wikilink element to stringify.
 * @returns A wikilink string.
 */
export const stringifyWikilinkElementToMarkdown = (
  element: WikilinkElement,
): string => {
  const label = getLiteralContent(element);

  if (!label || label === element.reference) {
    return `[[${element.reference}]]`;
  }

  return `[[${element.reference}|${label}]]`;
};
