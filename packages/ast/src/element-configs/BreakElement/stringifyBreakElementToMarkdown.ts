import { BreakElement } from './BreakElement.types';

const DefaultBreakSyntax = '  ';

/**
 * Stringifies a hard line break element into markdown.
 *
 * @param element - The break element to stringify.
 * @returns A markdown hard line break string.
 */
export const stringifyBreakElementToMarkdown = (
  element: BreakElement,
): string => {
  return `${element.syntax || DefaultBreakSyntax}\n`;
};
