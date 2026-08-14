import { InlineMathElement } from './InlineMathElement.types';

/**
 * Stringifies an inline math element into markdown.
 *
 * @param element - The inline math element to stringify.
 * @returns A markdown inline math string.
 */
export const stringifyInlineMathElementToMarkdown = (
  element: InlineMathElement,
): string => {
  return `$${element.value}$`;
};
