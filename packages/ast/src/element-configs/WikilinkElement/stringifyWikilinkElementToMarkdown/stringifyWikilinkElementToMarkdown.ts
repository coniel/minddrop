import { getLiteralContent, resolveWikilinkTarget } from '../../../utils';
import { WikilinkElement } from '../WikilinkElement.types';

/**
 * Stringifies a wikilink element into its markdown spelling.
 *
 * A link whose text is its own target is written without a label. This is
 * the spelling it was read from.
 *
 * @param element - The wikilink element to stringify.
 * @returns A wikilink string.
 */
export const stringifyWikilinkElementToMarkdown = (
  element: WikilinkElement,
): string => {
  // Get the link's text
  const label = getLiteralContent(element);
  // Resolve the target spelling
  const target = resolveWikilinkTarget(element.reference, element.fragment);

  // Check if the label is the target itself, or empty. If so, write the
  // link without one.
  if (!label || label === target) {
    return `[[${target}]]`;
  }

  // Write the link with its label
  return `[[${target}|${label}]]`;
};
