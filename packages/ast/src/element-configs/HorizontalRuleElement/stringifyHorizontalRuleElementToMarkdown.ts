import { HorizontalRuleElement } from './HorizontalRuleElement.types';

/**
 * Stringifies a horizontal-rule element.
 *
 * @param element - The horizontal-rule element to stringify.
 * @returns The markdown representation of the horizontal-rule element.
 */
export const stringifyHorizontalRuleElementToMarkdown = (
  element: HorizontalRuleElement,
): string => {
  return element.markdown;
};
