import { stringifyFragmentToMarkdown } from '../../stringifyFragmentToMarkdown';
import { HeadingElement } from './HeadingElement.types';

/**
 * Stringifies a heading element into markdown.
 *
 * @param element - The heading element to stringify.
 * @returns A markdown heading string.
 */
export const stringifyHeadingElementToMarkdown = (
  element: HeadingElement,
): string => {
  if (element.level === 1 && element.syntax === '=') {
    return `${stringifyFragmentToMarkdown(element.children)}\n${'='.repeat(
      stringifyFragmentToMarkdown(element.children).length,
    )}`;
  }

  if (element.level === 2 && element.syntax === '-') {
    return `${stringifyFragmentToMarkdown(element.children)}\n${'-'.repeat(
      stringifyFragmentToMarkdown(element.children).length,
    )}`;
  }

  return `${'#'.repeat(element.level)} ${stringifyFragmentToMarkdown(
    element.children,
  )}`;
};
