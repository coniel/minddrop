import { BlockElementStringifier } from '../../types';
import { HorizontalRuleElement } from './HorizontalRuleElement.types';

/**
 * Stringifies a horizontal-rule element.
 *
 * @param element - The horizontal-rule element to stringify.
 * @returns The markdown representation of the horizontal-rule element.
 */
export const stringifyHorizontalRuleElementToMarkdown: BlockElementStringifier<
  HorizontalRuleElement
> = (element: HorizontalRuleElement): string => {
  return element.markdown;
};
