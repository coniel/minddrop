import { stringifyFragmentToMarkdown } from '../../stringifyFragmentToMarkdown';
import { ParagraphElement } from './ParagraphElement.types';

/**
 * Stringifies paragraph elements.
 *
 * @param element - The paragraph element to stringify.
 * @returns A markdown paragraph string.
 */
export const stringifyParagraphElementToMarkdown = (
  element: ParagraphElement,
): string => {
  return stringifyFragmentToMarkdown(element.children);
};
