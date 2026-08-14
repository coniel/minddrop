import { UnsupportedElement } from './UnsupportedElement.types';

/**
 * Stringifies a construct the element model does not cover.
 *
 * @param element - The unsupported element to stringify.
 * @returns The construct's original source.
 */
export const stringifyUnsupportedElementToMarkdown = (
  element: UnsupportedElement,
): string => {
  return element.value;
};
