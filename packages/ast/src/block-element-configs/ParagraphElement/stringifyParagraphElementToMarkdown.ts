import { stringifyFragmentToMarkdown } from '../../stringifyFragmentToMarkdown';
import { BlockElementStringifier } from '../../types';
import { ParagraphElement } from './ParagraphElement.types';

/**
 * Stringifies paragraph elements.
 *
 * @param element - The paragraph element to stringify.
 * @returns A markdown paragraph string.
 */
export const stringifyParagraphElementToMarkdown: BlockElementStringifier<
  ParagraphElement
> = (element: ParagraphElement): string => {
  return stringifyFragmentToMarkdown(element.children);
};
