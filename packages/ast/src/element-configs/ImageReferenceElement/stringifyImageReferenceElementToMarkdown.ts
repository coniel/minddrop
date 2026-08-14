import { ImageReferenceElement } from './ImageReferenceElement.types';

/**
 * Stringifies an image reference element into markdown.
 *
 * @param element - The image reference element to stringify.
 * @returns A markdown image reference string.
 */
export const stringifyImageReferenceElementToMarkdown = (
  element: ImageReferenceElement,
): string => {
  const alt = element.alt || '';

  // A shortcut reference is just the label, with no second bracket pair
  if (element.referenceType === 'shortcut') {
    return `![${alt}]`;
  }

  // A collapsed reference uses the alt text as its own label
  if (element.referenceType === 'collapsed') {
    return `![${alt}][]`;
  }

  return `![${alt}][${element.label || element.identifier}]`;
};
