import { InlineHtmlElement } from './InlineHtmlElement.types';

/**
 * Stringifies an inline HTML element into markdown.
 *
 * @param element - The inline HTML element to stringify.
 * @returns The raw HTML.
 */
export const stringifyInlineHtmlElementToMarkdown = (
  element: InlineHtmlElement,
): string => {
  return element.value;
};
