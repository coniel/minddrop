import { HtmlElement } from './HtmlElement.types';

/**
 * Stringifies an HTML block element into markdown.
 *
 * @param element - The HTML element to stringify.
 * @returns The raw HTML.
 */
export const stringifyHtmlElementToMarkdown = (
  element: HtmlElement,
): string => {
  return element.value;
};
