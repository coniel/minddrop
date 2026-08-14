import { FootnoteReferenceElement } from './FootnoteReferenceElement.types';

/**
 * Stringifies a footnote reference element into markdown.
 *
 * @param element - The footnote reference element to stringify.
 * @returns A markdown footnote reference string.
 */
export const stringifyFootnoteReferenceElementToMarkdown = (
  element: FootnoteReferenceElement,
): string => {
  return `[^${element.label || element.identifier}]`;
};
