import { ThematicBreakElement } from './ThematicBreakElement.types';

/**
 * Stringifies a thematic break element.
 *
 * @param element - The thematic break element to stringify.
 * @returns The markdown representation of the thematic break element.
 */
export const stringifyThematicBreakElementToMarkdown = (
  element: ThematicBreakElement,
): string => {
  return element.syntax;
};
